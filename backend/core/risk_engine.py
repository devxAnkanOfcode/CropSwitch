from .data_loader import load_all_data


def get_village_risk_data(village_name):
    """
    Load NASA datasets for a selected village.
    """

    datasets = load_all_data()
    village_name = village_name.lower()

    village_data = {}

    for name, df in datasets.items():

        if "village" in df.columns:
            filtered_df = df[
                df["village"].str.lower() == village_name
            ]

        elif name == "gpm":
            # GPM is shared study-area rainfall data
            filtered_df = df.copy()

        else:
            filtered_df = df.iloc[0:0]

        village_data[name] = filtered_df

    # Verify village exists
    if village_data["smap"].empty:
        return None

    return village_data
def calculate_drought_risk(village_data):
    """
    Estimate preliminary drought risk using
    NASA GPM rainfall and SMAP soil moisture.
    """

    smap_df = village_data["smap"]
    gpm_df = village_data["gpm"]

    latest_smap = smap_df.sort_values("date").iloc[-1]
    latest_gpm = gpm_df.sort_values("date").iloc[-1]

    soil_moisture = latest_smap["sm_rootzone"]
    rainfall = latest_gpm["gpm_rain_mm_month"]

    score = 0

    # Root-zone soil moisture indicator
    if soil_moisture < 0.15:
        score += 50
    elif soil_moisture < 0.25:
        score += 30
    elif soil_moisture < 0.35:
        score += 15

    # Rainfall indicator
    if rainfall < 20:
        score += 50
    elif rainfall < 50:
        score += 30
    elif rainfall < 100:
        score += 15

    score = min(score, 100)

    if score >= 70:
        risk_level = "High"
    elif score >= 40:
        risk_level = "Moderate"
    else:
        risk_level = "Low"

    return {
        "risk_score": score,
        "risk_level": risk_level,
        "soil_moisture": float(soil_moisture),
        "rainfall_mm_month": float(rainfall)
    }
def calculate_soil_moisture_stress(village_data):
    """
    Estimate soil moisture stress using NASA SMAP.
    """

    smap_df = village_data["smap"]
    latest = smap_df.sort_values("date").iloc[-1]

    rootzone = latest["sm_rootzone"]
    surface = latest["sm_surface"]

    score = 0

    if rootzone < 0.15:
        score += 60
    elif rootzone < 0.25:
        score += 40
    elif rootzone < 0.35:
        score += 20

    if surface < 0.10:
        score += 40
    elif surface < 0.20:
        score += 20

    score = min(score, 100)

    if score >= 70:
        level = "High"
    elif score >= 40:
        level = "Moderate"
    else:
        level = "Low"

    return {
        "risk_score": score,
        "risk_level": level,
        "rootzone_moisture": float(rootzone),
        "surface_moisture": float(surface)
    }
def calculate_vegetation_stress(village_data):
    """
    Estimate vegetation stress using NASA MODIS NDVI.
    """

    ndvi_df = village_data["ndvi"].sort_values("date")

    latest = ndvi_df.iloc[-1]
    ndvi_value = latest["ndvi"]

    score = 0

    if ndvi_value < 0.2:
        score = 80
    elif ndvi_value < 0.3:
        score = 60
    elif ndvi_value < 0.4:
        score = 40
    elif ndvi_value < 0.5:
        score = 20

    if score >= 70:
        level = "High"
    elif score >= 40:
        level = "Moderate"
    else:
        level = "Low"

    return {
        "risk_score": score,
        "risk_level": level,
        "latest_ndvi": float(ndvi_value)
    }
def calculate_water_storage_risk(village_data):
    """
    Analyse water storage trends using NASA GRACE.
    """

    grace_df = village_data["grace"].sort_values("date")

    latest = grace_df.iloc[-1]

    water_storage = latest["grace_ewt_cm"]
    uncertainty = latest["grace_uncertainty_cm"]

    # Compare latest storage with the previous 12 months
    previous_year = grace_df.iloc[-13:-1]

    baseline = previous_year["grace_ewt_cm"].mean()

    change = water_storage - baseline

    if change < -2:
        score = 80
        level = "High"
    elif change < 0:
        score = 50
        level = "Moderate"
    else:
        score = 20
        level = "Low"

    return {
        "risk_score": score,
        "risk_level": level,
        "latest_water_storage_cm": float(water_storage),
        "previous_12_month_average_cm": round(float(baseline), 3),
        "change_cm": round(float(change), 3),
        "uncertainty_cm": float(uncertainty)
    }
def generate_risk_analysis(village_name):
    """
    Generate complete risk analysis for a village.
    """

    village_data = get_village_risk_data(village_name)

    if village_data is None:
        return {
            "error": "Village not found"
        }

    drought = calculate_drought_risk(village_data)

    soil_stress = calculate_soil_moisture_stress(
        village_data
    )

    vegetation = calculate_vegetation_stress(
        village_data
    )

    water_storage = calculate_water_storage_risk(
        village_data
    )

    return {
        "village": village_name.title(),
        "risk_analysis": {
            "drought": drought,
            "soil_moisture_stress": soil_stress,
            "vegetation_stress": vegetation,
            "water_storage_risk": water_storage
        },
        "message": "Preliminary risk analysis based on NASA satellite indicators."
    }
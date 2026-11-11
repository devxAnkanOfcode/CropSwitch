from .data_loader import load_all_data


def get_village_data(village_name):
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
            # GPM rainfall is shared study-area data
            filtered_df = df.copy()

        else:
            filtered_df = df.iloc[0:0]

        village_data[name] = filtered_df

    return village_data
def get_latest_conditions(village_data):
    """
    Extract the latest available NASA measurements.
    """

    conditions = {}

    for name, df in village_data.items():

        if df.empty:
            continue

        df = df.sort_values("date")
        latest = df.iloc[-1]

        conditions[name] = latest.to_dict()

    return conditions
def calculate_crop_scores(conditions):
    """
    Calculate preliminary crop suitability scores
    using NASA environmental indicators.
    """

    scores = {
        "Ragi (Millet)": 50,
        "Mung Bean": 50,
        "Mustard": 50
    }

    smap = conditions.get("smap", {})
    power = conditions.get("power", {})
    ndvi = conditions.get("ndvi", {})

    soil_moisture = smap.get("sm_rootzone")
    temperature = power.get("temp_avg_c")
    humidity = power.get("humidity_pct")
    vegetation = ndvi.get("ndvi")

    # Ragi: preliminary warm and relatively
    # moisture-tolerant crop profile
    if temperature is not None:
        if 20 <= temperature <= 30:
            scores["Ragi (Millet)"] += 15
        elif temperature > 35:
            scores["Ragi (Millet)"] -= 10

    # Mung bean: preliminary warm-season profile
    if temperature is not None:
        if 25 <= temperature <= 35:
            scores["Mung Bean"] += 15
        elif temperature < 15:
            scores["Mung Bean"] -= 10

    # Mustard: preliminary cooler-season profile
    if temperature is not None:
        if 15 <= temperature <= 25:
            scores["Mustard"] += 15
        elif temperature > 30:
            scores["Mustard"] -= 10

    # Soil moisture indicator
    if soil_moisture is not None:
        if soil_moisture < 0.2:
            scores["Ragi (Millet)"] += 10
            scores["Mung Bean"] -= 5
        elif soil_moisture > 0.4:
            scores["Mung Bean"] += 5

    # Humidity indicator
    if humidity is not None and humidity > 80:
        scores["Mustard"] -= 5

    # NDVI is contextual evidence, not a direct
    # crop-specific suitability measurement.
    if vegetation is not None and vegetation < 0.3:
        for crop in scores:
            scores[crop] -= 5

    # Keep scores between 0 and 100
    return {
        crop: max(0, min(100, score))
        for crop, score in scores.items()
    }
def generate_crop_recommendation(village_name):
    """
    Generate crop recommendations for a selected village.
    """

    village_data = get_village_data(village_name)

    # Check whether the village exists
    if village_data["smap"].empty:
        return {
            "error": "Village not found"
        }

    # Get latest NASA measurements
    conditions = get_latest_conditions(village_data)

    # Calculate crop suitability scores
    scores = calculate_crop_scores(conditions)

    # Sort crops from highest to lowest score
    ranked_crops = sorted(
        scores.items(),
        key=lambda item: item[1],
        reverse=True
    )

    recommendations = []

    for crop, score in ranked_crops:
        recommendations.append({
            "crop": crop,
            "suitability_score": score
        })

    return {
        "village": village_name.title(),
        "recommendations": recommendations,
        "data_sources": [
            "NASA SMAP",
            "NASA POWER",
            "NASA MODIS NDVI"
        ],
        "message": "Preliminary recommendations based on available NASA indicators."
    }

from .risk_engine import generate_risk_analysis
def generate_alerts(village_name):
    """
    Generate environmental alerts for a village.
    """

    analysis = generate_risk_analysis(village_name)

    if "error" in analysis:
        return analysis

    risks = analysis["risk_analysis"]

    alerts = []

    # Drought alert
    drought = risks["drought"]

    if drought["risk_level"] in ["High", "Moderate"]:
        alerts.append({
            "type": "Drought",
            "severity": drought["risk_level"],
            "message": (
                f"Drought risk detected in {village_name}. "
                "Monitor rainfall and soil moisture."
            )
        })

    # Soil moisture alert
    soil = risks["soil_moisture_stress"]

    if soil["risk_level"] in ["High", "Moderate"]:
        alerts.append({
            "type": "Soil Moisture Stress",
            "severity": soil["risk_level"],
            "message": (
                f"Soil moisture stress detected in {village_name}. "
                "Check irrigation requirements."
            )
        })

    # Vegetation alert
    vegetation = risks["vegetation_stress"]

    if vegetation["risk_level"] in ["High", "Moderate"]:
        alerts.append({
            "type": "Vegetation Stress",
            "severity": vegetation["risk_level"],
            "message": (
                f"Vegetation stress detected in {village_name}. "
                "Monitor crop health."
            )
        })

    # Water storage alert
    water = risks["water_storage_risk"]

    if water["risk_level"] in ["High", "Moderate"]:
        alerts.append({
            "type": "Water Storage",
            "severity": water["risk_level"],
            "message": (
                f"Declining water storage indicator in {village_name}. "
                "Monitor local water availability."
            )
        })

    return {
        "village": village_name.title(),
        "total_alerts": len(alerts),
        "alerts": alerts
    }
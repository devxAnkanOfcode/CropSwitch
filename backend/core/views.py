from django.http import JsonResponse
from .data_loader import load_smap_data, load_ndvi_data, load_gpm_data, load_grace_data, load_power_data, load_all_data
from .data_loader import (
    load_smap_data,
    load_ndvi_data,
    load_gpm_data,
    load_grace_data,
    load_power_data,
    load_all_data,
)
from django.views.decorators.http import require_GET
import pandas as pd
from .crop_engine import generate_crop_recommendation
from .risk_engine import generate_risk_analysis
from .alert_engine import generate_alerts
from .models import Alert
def smap_api(request):
    df = load_smap_data()

    return JsonResponse({
        "dataset": "NASA SMAP",
        "total_records": len(df),
        "columns": list(df.columns),
        "first_5_records": df.head(5).to_dict(orient="records")
    })
def ndvi_api(request):
    df = load_ndvi_data()

    return JsonResponse({
        "dataset": "NASA MODIS NDVI",
        "total_records": len(df),
        "columns": list(df.columns),
        "first_5_records": df.head(5).to_dict(orient="records")
    })
def gpm_api(request):
    df = load_gpm_data()

    return JsonResponse({
        "dataset": "NASA GPM IMERG",
        "total_records": len(df),
        "columns": list(df.columns),
        "first_5_records": df.head(5).to_dict(orient="records"),
        "last_5_records": df.tail(5).to_dict(orient="records")
    })
def grace_api(request):
    df = load_grace_data()

    return JsonResponse({
        "dataset": "NASA GRACE-FO",
        "total_records": len(df),
        "columns": list(df.columns),
        "first_5_records": df.head(5).to_dict(orient="records"),
        "last_5_records": df.tail(5).to_dict(orient="records")
    })
def power_api(request):
    df = load_power_data()

    return JsonResponse({
        "dataset": "NASA POWER",
        "total_records": len(df),
        "columns": list(df.columns),
        "first_5_records": df.head(5).to_dict(orient="records"),
        "last_5_records": df.tail(5).to_dict(orient="records")
    })
def dashboard_api(request):
    datasets = load_all_data()

    return JsonResponse({
        "project": "CropSwitch",
        "message": "Combined NASA agricultural datasets",
        "datasets": {
            name: {
                "total_records": len(df),
                "columns": list(df.columns),
                "records": df.to_dict(orient="records")
            }
            for name, df in datasets.items()
        }
    })
@require_GET
def village_api(request, village_name):
    datasets = load_all_data()

    village_name = village_name.lower()

    village_datasets = {}

    for name, df in datasets.items():

        if "village" in df.columns:
            filtered_df = df[
                df["village"].str.lower() == village_name
            ]

        elif name == "gpm":
            filtered_df = df.copy()

        else:
            filtered_df = df.iloc[0:0]

        village_datasets[name] = {
            "total_records": len(filtered_df),
            "records": filtered_df.to_dict(orient="records")
        }

    if not any(
        item["total_records"] > 0
        for name, item in village_datasets.items()
        if name != "gpm"
    ):
        return JsonResponse(
            {"error": "Village not found"},
            status=404
        )

    return JsonResponse({
        "village": village_name.title(),
        "datasets": village_datasets
    })
@require_GET
def village_trends_api(request, village_name):
    datasets = load_all_data()

    village_name = village_name.lower()

    # Get the requested dataset
    dataset_name = request.GET.get("dataset", "").lower()

    allowed_datasets = ["smap", "ndvi", "gpm", "grace", "power"]

    if dataset_name not in allowed_datasets:
        return JsonResponse({
            "error": "Invalid or missing dataset",
            "allowed_datasets": allowed_datasets
        }, status=400)

    # Check whether the village exists
    smap_df = datasets["smap"]

    village_exists = (
        smap_df["village"].str.lower() == village_name
    ).any()

    if not village_exists:
        return JsonResponse({
            "error": "Village not found"
        }, status=404)

    df = datasets[dataset_name]

    # GPM is shared study-area rainfall data
    if "village" in df.columns:
        df = df[
            df["village"].str.lower() == village_name
        ]

    # Sort records by date
    df = df.sort_values("date")

    return JsonResponse({
        "village": village_name.title(),
        "dataset": dataset_name,
        "total_records": len(df),
        "columns": list(df.columns),
        "records": df.to_dict(orient="records")
    })
@require_GET
def dashboard_summary_api(request):
    datasets = load_all_data()

    ndvi_df = datasets["ndvi"]
    smap_df = datasets["smap"]
    gpm_df = datasets["gpm"]
    power_df = datasets["power"]
    grace_df = datasets["grace"]

    # Latest available records
    latest_ndvi = ndvi_df.sort_values("date").iloc[-1]
    latest_smap = smap_df.sort_values("date").iloc[-1]
    latest_gpm = gpm_df.sort_values("date").iloc[-1]
    latest_power = power_df.sort_values("date").iloc[-1]
    latest_grace = grace_df.sort_values("date").iloc[-1]

    return JsonResponse({
        "project": "CropSwitch",
        "summary": {
            "average_ndvi": round(float(ndvi_df["ndvi"].mean()), 3),
            "latest_soil_moisture": round(
                float(latest_smap["sm_rootzone"]), 3
            ),
            "latest_rainfall_mm": round(
                float(latest_gpm["gpm_rain_mm_month"]), 2
            ),
            "latest_temperature_c": round(
                float(latest_power["temp_avg_c"]), 2
            ),
            "latest_groundwater_cm": round(
                float(latest_grace["grace_ewt_cm"]), 2
            )
        }
    })
@require_GET
def crop_recommendation_api(request, village_name):
    result = generate_crop_recommendation(village_name)

    if "error" in result:
        return JsonResponse(result, status=404)

    return JsonResponse(result)
@require_GET
def risk_analysis_api(request, village_name):
    result = generate_risk_analysis(village_name)

    if "error" in result:
        return JsonResponse(result, status=404)

    return JsonResponse(result)

@require_GET
def alert_api(request, village_name):
    result = generate_alerts(village_name)

    if "error" in result:
        return JsonResponse(result, status=404)

    saved_alerts = []

    for alert in result["alerts"]:
        saved_alert, created = Alert.objects.get_or_create(
            village=result["village"],
            alert_type=alert["type"],
            severity=alert["severity"],
            message=alert["message"],
            defaults={
                "delivery_status": "Pending"
            }
        )

        saved_alerts.append({
            "id": saved_alert.id,
            "type": saved_alert.alert_type,
            "severity": saved_alert.severity,
            "message": saved_alert.message,
            "delivery_status": saved_alert.delivery_status
        })

    return JsonResponse({
        "village": result["village"],
        "total_alerts": len(saved_alerts),
        "alerts": saved_alerts
    })

@require_GET
def saved_alerts_api(request, village_name):
    alerts = Alert.objects.filter(
        village__iexact=village_name
    )

    severity = request.GET.get("severity")

    if severity:
        valid_severities = ["Low", "Moderate", "High"]

        if severity not in valid_severities:
            return JsonResponse({
                "error": "Invalid severity. Use Low, Moderate, or High."
            }, status=400)

        alerts = alerts.filter(severity=severity)

    alerts = alerts.order_by("-created_at")

    alert_list = []

    for alert in alerts:
        alert_list.append({
            "id": alert.id,
            "village": alert.village,
            "type": alert.alert_type,
            "severity": alert.severity,
            "message": alert.message,
            "created_at": alert.created_at.isoformat(),
            "delivery_status": alert.delivery_status
        })

    return JsonResponse({
        "village": village_name.title(),
        "total_alerts": len(alert_list),
        "alerts": alert_list
    })
@require_GET
def alert_statistics_api(request, village_name):

    alerts = Alert.objects.filter(
        village__iexact=village_name
    )

    total = alerts.count()
    high = alerts.filter(severity="High").count()
    moderate = alerts.filter(severity="Moderate").count()
    low = alerts.filter(severity="Low").count()

    return JsonResponse({
        "village": village_name.title(),
        "total_alerts": total,
        "high": high,
        "moderate": moderate,
        "low": low
    })
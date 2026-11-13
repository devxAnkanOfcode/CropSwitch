
from django.urls import path
from . import views

urlpatterns = [
    path('smap/', views.smap_api, name='smap_api'),
    path('ndvi/', views.ndvi_api, name='ndvi_api'),
    path('gpm/', views.gpm_api, name='gpm_api'),
    path('grace/', views.grace_api, name='grace_api'),
    path('power/', views.power_api, name='power_api'),
    path('dashboard/', views.dashboard_api, name='dashboard_api'),
    path('village/<str:village_name>/', views.village_api, name='village_api'),
    path(
    'village/<str:village_name>/trends/',
    views.village_trends_api,
    name='village_trends_api'
),
path(
    'dashboard/summary/',
    views.dashboard_summary_api,
    name='dashboard_summary_api'
),
path(
    "crop-recommendation/<str:village_name>/"
    ,
    views.crop_recommendation_api,
    name='crop_recommendation_api'
),
path(
    'risk-analysis/<str:village_name>/',
    views.risk_analysis_api,
    name='risk_analysis_api'
),
path(
    'alerts/<str:village_name>/',
    views.alert_api,
    name='alert_api'
),
path('saved-alerts/<str:village_name>/', views.saved_alerts_api, name='saved_alerts_api'),
path(
    'alert-statistics/<str:village_name>/',
    views.alert_statistics_api,
    name='alert_statistics_api'
),
]

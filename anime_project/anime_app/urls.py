from anime_app import views
from django.urls import path
from django.contrib.auth.decorators import login_required

urlpatterns = [
    path('', views.login_view, name="login"),  # Root URL redirects to login
    path('login/', views.login_view, name="login"),
    path('logout/', views.logout_view, name="logout"),
    path('register/', views.register_view, name="register"),
    path('home/', views.home_view, name="home"),
    path('favourites/', views.favourites_view, name="favourites"),
    path('base/', views.base_view, name="base"),
    path('description/', views.desc_view, name="description"),
]
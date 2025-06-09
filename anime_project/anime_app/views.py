from django.shortcuts import redirect, render, HttpResponse
from datetime import datetime
from anime_app.models import user_detail
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

# Create your views here.


def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect("/home")
        else:
            messages.success(request, "Invalid credientials")

    return render(request, "login.html")


def logout_view(request):
    logout(request)
    return redirect("login")


#@login_required(login_url="login") # to make this view accessible to only logged in users
def home_view(request):
    return render(request, "home.html")

@login_required(login_url="login") # to make this view accessible to only logged in users
def base_view(request):
    return render(request, "base.html")


@login_required(login_url="login") # to make this view accessible to only logged in users
def favourites_view(request):
    return render(request, "favourites.html")


def register_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")

        # validate form data
        if not (username and email and password):
            messages.error(request, "All fields are required")
            return render(request, "register.html")

        try:
            # checks if username already exists
            if User.objects.filter(username=username).exists():
                messages.error(request, "Username already exists")
                return render(request, "register.html")

            # Check if email already exists
            # if User.objects.filter(email=email).exists():
            #     messages.error(request, "Email already registered")
            #     return render(request, "register.html")

            # create new user
            user = User.objects.create_user(
                username=username, email=email, password=password
            )
            user.save()

            # messages.success(request, "Registration successful! Please login.")
            return redirect("login")

        except Exception as e:
            messages.error(request, f"Registration failed: {str(e)}")
            return render(request, "register.html")

    return render(request, "register.html")


def desc_view(request):
    # getting the query parameters
    title = request.GET.get('title', '')
    image = request.GET.get('image', '')
    synopsis = request.GET.get('synopsis', '')
    
    # passing values as a template value dictionary
    context = {
        'title': title,
        'image': image,
        'synopsis': synopsis
    }
    
    return render(request, "desc.html", context)
@echo off
git init
git remote remove origin 2>nul
git remote add origin https://github.com/laetherapp/laether-app.git
git add .
git commit -m "mise a jour"
git branch -M main
git push -f origin main
echo.
echo Deploiement termine. Tu peux fermer cette fenetre.
pause

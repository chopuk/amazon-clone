@echo off
cls
echo Pushing changes to GitHub..
echo.
git add .
git commit -m "More Changes"
git push
echo.
echo Done!
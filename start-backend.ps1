Write-Host "Starting Email System Backend Server..." -ForegroundColor Green
Set-Location backend
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install
Write-Host "Starting server..." -ForegroundColor Green
npm start

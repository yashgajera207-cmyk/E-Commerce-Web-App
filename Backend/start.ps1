# ShopZone Backend — Safe Start Script
# Automatically frees port 5000 before starting the server

$PORT = 5000

Write-Host "`n🔍 Checking if port $PORT is in use..." -ForegroundColor Cyan

$connections = netstat -ano | Select-String ":$PORT\s" | Select-String "LISTENING"

if ($connections) {
    $pid_match = ($connections | Select-Object -First 1) -match '\s+(\d+)\s*$'
    $oldPid = $Matches[1]
    
    Write-Host "⚠️  Port $PORT is in use by PID $oldPid. Killing it..." -ForegroundColor Yellow
    taskkill /PID $oldPid /F | Out-Null
    Start-Sleep -Milliseconds 500
    Write-Host "✅ Port $PORT freed." -ForegroundColor Green
} else {
    Write-Host "✅ Port $PORT is free." -ForegroundColor Green
}

Write-Host "`n🚀 Starting ShopZone Backend Server...`n" -ForegroundColor Cyan
node server.js

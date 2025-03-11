
try {
    Write-Host "Navigating to frontend directory..."
    Set-Location -Path "./GameSpaceBackend/routes"
    Write-Host "Attempting to run the backend..."
    py routes.py
} catch {
    Write-Error "Failed to navigate to backend directory or run backend app"
    exit 1
}


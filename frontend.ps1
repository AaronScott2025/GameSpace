
try {
    Write-Host "Navigating to frontend directory..."
    Set-Location -Path "./frontend"
    Write-Host "Attempting to run the frontend..."
    npm run dev
} catch {
    Write-Error "Failed to navigate to frontend directory or run frontend app"
    exit 1
}


try {
    Write-Host "Navigating to frontend directory..."
    Set-Location -Path "./frontend"
    Write-Host "Installing frontend dependencies..."
    npm install
} catch {
    Write-Error "Failed to navigate to frontend directory or install frontend dependencies"
    exit 1
}
Set-Location -Path ".."
try {
    Write-Host "Navigating to GameSpaceBackend directory..."
    Set-Location -Path "./GameSpaceBackend"
    Write-Host "Installing backend dependencies..."
    pip install -r requirements.txt
} catch {
    Write-Error "Failed to navigate to GameSpaceBackend directory or install backend dependencies"
    exit 1
}
Write-Host "All dependencies installed successfully!"

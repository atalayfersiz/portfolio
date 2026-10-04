Add-Type -AssemblyName System.Drawing

$files = Get-ChildItem -Path "public\projects\parametric" -Recurse -Filter "*.bmp"
foreach ($file in $files) {
    $img = [System.Drawing.Image]::FromFile($file.FullName)
    $dest = [System.IO.Path]::ChangeExtension($file.FullName, ".jpg")
    $img.Save($dest, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $img.Dispose()
    Write-Host "Converted $($file.FullName) -> $dest"
}

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const BACKUP_DIR = path.join(ROOT_DIR, "backups");

// Directories and files to exclude from backups
const EXCLUDE_LIST = new Set([
  "node_modules",
  ".next",
  ".git",
  "backups",
  ".turbo",
  ".vercel",
  "dist",
  "out",
  ".DS_Store",
  "npm-debug.log",
  "yarn-error.log",
]);

function getFormattedTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

function copyDirectoryRecursive(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const items = fs.readdirSync(source, { withFileTypes: true });

  let totalFiles = 0;
  let totalBytes = 0;

  for (const item of items) {
    if (EXCLUDE_LIST.has(item.name)) continue;

    const sourcePath = path.join(source, item.name);
    const targetPath = path.join(target, item.name);

    if (item.isDirectory()) {
      const stats = copyDirectoryRecursive(sourcePath, targetPath);
      totalFiles += stats.totalFiles;
      totalBytes += stats.totalBytes;
    } else if (item.isFile()) {
      fs.copyFileSync(sourcePath, targetPath);
      const stat = fs.statSync(sourcePath);
      totalFiles += 1;
      totalBytes += stat.size;
    }
  }

  return { totalFiles, totalBytes };
}

function listBackups() {
  if (!fs.existsSync(BACKUP_DIR)) {
    console.log("\n📁 No backups found yet. Backups folder is empty.\n");
    return;
  }

  const entries = fs.readdirSync(BACKUP_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith("backup_"))
    .sort((a, b) => b.name.localeCompare(a.name));

  if (entries.length === 0) {
    console.log("\n📁 No backups found.\n");
    return;
  }

  console.log(`\n================ EXISTING BACKUPS (${entries.length}) ================`);
  entries.forEach((entry, idx) => {
    const metaPath = path.join(BACKUP_DIR, entry.name, "backup-metadata.json");
    let metaInfo = "";
    if (fs.existsSync(metaPath)) {
      try {
        const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
        metaInfo = ` | Note: "${meta.note}" | Files: ${meta.totalFiles} (${(meta.totalBytes / (1024 * 1024)).toFixed(2)} MB)`;
      } catch (e) {}
    }
    console.log(`[${idx + 1}] ${entry.name}${metaInfo}`);
  });
  console.log("========================================================\n");
}

function createBackup() {
  const args = process.argv.slice(2);
  if (args.includes("--list") || args.includes("-l")) {
    listBackups();
    return;
  }

  // Optional custom label note passed via CLI
  let customLabel = args.filter((arg) => !arg.startsWith("-")).join("_").trim();
  customLabel = customLabel.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+/g, "_");

  const timestamp = getFormattedTimestamp();
  const folderName = customLabel ? `backup_${timestamp}_${customLabel}` : `backup_${timestamp}`;
  const targetBackupPath = path.join(BACKUP_DIR, folderName);

  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  console.log(`\n📦 Creating backup: "${folderName}" ...`);
  const startTime = Date.now();

  const { totalFiles, totalBytes } = copyDirectoryRecursive(ROOT_DIR, targetBackupPath);

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  const sizeMB = (totalBytes / (1024 * 1024)).toFixed(2);

  // Write metadata file into backup snapshot
  const metadata = {
    backupName: folderName,
    createdAt: new Date().toISOString(),
    timestampFormatted: timestamp,
    note: customLabel || "Standard Snapshot",
    totalFiles,
    totalBytes,
    sizeMB: `${sizeMB} MB`,
  };

  fs.writeFileSync(
    path.join(targetBackupPath, "backup-metadata.json"),
    JSON.stringify(metadata, null, 2),
    "utf-8"
  );

  console.log(`\n✅ Backup successfully completed!`);
  console.log(`📁 Location:  ${targetBackupPath}`);
  console.log(`📊 Stats:     ${totalFiles} files | ${sizeMB} MB`);
  console.log(`⏱️  Duration:  ${durationSec}s`);
  console.log(`💡 To list backups: npm run backup:list`);
  console.log(`💡 To restore:      npm run backup:restore\n`);
}

createBackup();

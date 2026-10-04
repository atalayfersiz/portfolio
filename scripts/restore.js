const fs = require("fs");
const path = require("path");
const readline = require("readline");

const ROOT_DIR = path.resolve(__dirname, "..");
const BACKUP_DIR = path.join(ROOT_DIR, "backups");

const EXCLUDE_FROM_RESTORE = new Set([
  "node_modules",
  ".next",
  ".git",
  "backups",
  "backup-metadata.json",
]);

function copyDirectoryRecursive(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const items = fs.readdirSync(source, { withFileTypes: true });

  for (const item of items) {
    if (EXCLUDE_FROM_RESTORE.has(item.name)) continue;

    const sourcePath = path.join(source, item.name);
    const targetPath = path.join(target, item.name);

    if (item.isDirectory()) {
      copyDirectoryRecursive(sourcePath, targetPath);
    } else if (item.isFile()) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

function restore() {
  if (!fs.existsSync(BACKUP_DIR)) {
    console.log("\n❌ No backups folder found.\n");
    return;
  }

  const entries = fs.readdirSync(BACKUP_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith("backup_"))
    .sort((a, b) => b.name.localeCompare(a.name));

  if (entries.length === 0) {
    console.log("\n❌ No backups available to restore.\n");
    return;
  }

  console.log("\n================ SELECT BACKUP TO RESTORE ================");
  entries.forEach((entry, idx) => {
    const metaPath = path.join(BACKUP_DIR, entry.name, "backup-metadata.json");
    let note = "";
    if (fs.existsSync(metaPath)) {
      try {
        const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
        note = ` [${meta.note}]`;
      } catch (e) {}
    }
    console.log(`  [${idx + 1}] ${entry.name}${note}`);
  });
  console.log("==========================================================\n");

  const specificArg = process.argv[2];
  if (specificArg) {
    const matched = entries.find((e) => e.name === specificArg || e.name.includes(specificArg));
    if (matched) {
      performRestore(matched.name);
      return;
    }
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter number or backup name to restore (or 'q' to cancel): ", (answer) => {
    rl.close();
    const cleanAnswer = answer.trim();
    if (cleanAnswer.toLowerCase() === "q" || !cleanAnswer) {
      console.log("Cancelled restore.");
      return;
    }

    const num = parseInt(cleanAnswer, 10);
    let selectedBackup = null;

    if (!isNaN(num) && num >= 1 && num <= entries.length) {
      selectedBackup = entries[num - 1].name;
    } else {
      const match = entries.find((e) => e.name.toLowerCase().includes(cleanAnswer.toLowerCase()));
      if (match) selectedBackup = match.name;
    }

    if (!selectedBackup) {
      console.log("❌ Invalid backup selection.");
      return;
    }

    performRestore(selectedBackup);
  });
}

function performRestore(backupFolderName) {
  const sourcePath = path.join(BACKUP_DIR, backupFolderName);
  console.log(`\n⏳ Restoring from: ${backupFolderName} ...`);

  copyDirectoryRecursive(sourcePath, ROOT_DIR);

  console.log(`\n✅ Project successfully restored to state: ${backupFolderName}\n`);
}

restore();

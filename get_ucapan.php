<?php
/**
 * get_ucapan.php — Fetch all ucapan (greetings) from SQLite
 * Backend: PDO SQLite | Auto-creates database.sqlite & table
 * Output: JSON array
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Cache-Control: no-store, no-cache, must-revalidate');

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ── Database path ─────────────────────────────────────────
define('DB_PATH', __DIR__ . '/database.sqlite');

// ── Auto-create DB & table ────────────────────────────────
function getDB(): PDO {
    $pdo = new PDO('sqlite:' . DB_PATH);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    $pdo->exec('PRAGMA journal_mode=WAL');

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS ucapan (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            nama       TEXT    NOT NULL,
            status     TEXT    NOT NULL DEFAULT 'Belum Tentukan',
            pesan      TEXT    NOT NULL,
            created_at DATETIME DEFAULT (datetime('now','localtime'))
        )
    ");

    return $pdo;
}

// ── Query ─────────────────────────────────────────────────
try {
    $pdo  = getDB();

    // Optional: limit to recent 100
    $stmt = $pdo->query("
        SELECT id, nama, status, pesan, created_at
        FROM   ucapan
        ORDER  BY id DESC
        LIMIT  100
    ");

    $rows = $stmt->fetchAll();

    // Cast id to int for clean JSON
    $rows = array_map(function ($row) {
        $row['id'] = (int) $row['id'];
        return $row;
    }, $rows);

    echo json_encode($rows, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}

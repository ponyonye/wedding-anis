<?php
/**
 * rsvp.php — RSVP & Ucapan submit endpoint
 * Backend: PDO SQLite | Auto-creates database.sqlite & table
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// ── Database path (same directory as script) ──────────────
define('DB_PATH', __DIR__ . '/database.sqlite');

// ── Auto-create DB & table ────────────────────────────────
function getDB(): PDO {
    $pdo = new PDO('sqlite:' . DB_PATH);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Enable WAL for better concurrency
    $pdo->exec('PRAGMA journal_mode=WAL');

    // Auto-create table
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

// ── Parse JSON body ───────────────────────────────────────
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data || !is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// ── Sanitize ──────────────────────────────────────────────
$nama   = trim(strip_tags($data['nama']   ?? ''));
$status = trim(strip_tags($data['status'] ?? ''));
$pesan  = trim(strip_tags($data['pesan']  ?? ''));

$allowed_status = ['Hadir', 'Tidak Hadir', 'Belum Tentukan'];

if (empty($nama) || empty($pesan)) {
    http_response_code(422);
    echo json_encode(['error' => 'Nama dan pesan wajib diisi']);
    exit;
}

if (!in_array($status, $allowed_status, true)) {
    $status = 'Belum Tentukan';
}

// Limit lengths
$nama  = mb_substr($nama,  0, 100);
$pesan = mb_substr($pesan, 0, 1000);

// ── Insert ────────────────────────────────────────────────
try {
    $pdo  = getDB();
    $stmt = $pdo->prepare("
        INSERT INTO ucapan (nama, status, pesan)
        VALUES (:nama, :status, :pesan)
    ");
    $stmt->execute([
        ':nama'   => $nama,
        ':status' => $status,
        ':pesan'  => $pesan,
    ]);

    $id = $pdo->lastInsertId();

    echo json_encode([
        'success' => true,
        'id'      => (int) $id,
        'message' => 'Ucapan berhasil disimpan'
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}

import * as sqlite from 'expo-sqlite';

export const db = sqlite.openDatabaseSync('markers.db');

export const initDatabase = async () => {
  try {
    // Создать таблицу маркеров
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS markers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`
    );
    // Создать таблицу изображений иаркеров
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS marker_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        marker_id INTEGER NOT NULL,
        uri TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (marker_id) REFERENCES markers (id) ON DELETE CASCADE
      );`
    );
    // Проверка количества маркеров в базе
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(id) as count FROM markers;'
    );
    const markerCount = result?.count ?? 0;

    if (markerCount === 0) {
      // Добавить первый маркер в базу данных
      await db.runAsync(
        'INSERT INTO markers (latitude, longitude) VALUES (?, ?);',
        [58.0105, 56.2502]
      );
    }
    return db;
  } catch (error) {
    console.error('Ошибка инициализации базы данных:', error);
    throw error;
  }
};
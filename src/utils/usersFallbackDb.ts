import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'users_fallback.json');

const getSeedUsers = () => {
  const fallbackUser = process.env.ADMIN_USERNAME || 'admin';
  const fallbackPass = process.env.ADMIN_PASSWORD || 'iskcon123';
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(fallbackPass, salt);

  return [
    {
      _id: 'local_admin_id',
      id: 'local_admin_id',
      username: fallbackUser,
      password: hashedPassword,
      role: 'admin',
      email: 'admin@iskcondurgapur.com',
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
};

function ensureInitialized(): any[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const seed = getSeedUsers();
    fs.writeFileSync(DATA_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading users fallback JSON database, resetting:', err);
    const seed = getSeedUsers();
    fs.writeFileSync(DATA_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
}

export const usersFallbackDb = {
  getAll(): any[] {
    return ensureInitialized();
  },

  getById(id: string): any | null {
    const list = ensureInitialized();
    return list.find(u => u._id === id || u.id === id) || null;
  },

  getByUsername(username: string): any | null {
    const list = ensureInitialized();
    return list.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
  },

  create(data: any): any {
    const list = ensureInitialized();
    
    let passwordHash = data.password;
    if (passwordHash && !passwordHash.startsWith('$2a$') && !passwordHash.startsWith('$2b$')) {
      const salt = bcrypt.genSaltSync(10);
      passwordHash = bcrypt.hashSync(passwordHash, salt);
    }

    const newUser = {
      ...data,
      password: passwordHash,
      _id: data._id || `user_${Date.now()}`,
      id: data._id || `user_${Date.now()}`,
      twoFactorEnabled: data.twoFactorEnabled || false,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString()
    };
    list.push(newUser);
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return newUser;
  },

  update(id: string, data: any): any | null {
    const list = ensureInitialized();
    const index = list.findIndex(u => u._id === id || u.id === id);
    if (index === -1) return null;

    let passwordHash = data.password || list[index].password;
    if (data.password && !data.password.startsWith('$2a$') && !data.password.startsWith('$2b$')) {
      const salt = bcrypt.genSaltSync(10);
      passwordHash = bcrypt.hashSync(data.password, salt);
    }

    const updated = {
      ...list[index],
      ...data,
      password: passwordHash,
      updatedAt: new Date().toISOString()
    };
    list[index] = updated;
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return updated;
  },

  delete(id: string): boolean {
    const list = ensureInitialized();
    const filtered = list.filter(u => u._id !== id && u.id !== id);
    if (list.length === filtered.length) return false;
    fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  }
};

import 'reflect-metadata';
import { createHash, randomBytes } from 'node:crypto';
import { MikroORM } from '@mikro-orm/core';
import { MongoDriver } from '@mikro-orm/mongodb';
import { Product } from './product/entities/product.entity';
import { ProductImage } from './product/entities/product-image.embeddable';
import { ProductRating } from './product/entities/product-rating.embeddable';
import { User } from './user/entities/user.entity';

const CATEGORIES = [
  {
    tag: 'security',
    color: 'fecaca/7f1d1d',
    names: ['SecureShield', 'CipherGuard', 'SafeNet', 'DataGuard', 'FireWall Pro', 'VPN Shield', 'PasswordVault', 'AntiThreat', 'CloudProtect', 'ThreatDetector'],
    keywords: ['security', 'protect', 'encrypt', 'safe', 'threat', 'guard'],
  },
  {
    tag: 'office',
    color: 'bfdbfe/1e3a8a',
    names: ['DocMaster', 'SpreadPro', 'PresentStudio', 'NoteSync', 'TaskManager', 'OfficeHub', 'FormBuilder', 'ReportMaster', 'CalendarSync', 'ProjectPilot'],
    keywords: ['office', 'document', 'productivity', 'collaborate', 'workspace'],
  },
  {
    tag: 'dev',
    color: 'bbf7d0/14532d',
    names: ['CodeStudio', 'DebugMaster', 'BuildPipeline', 'GitManager', 'APITester', 'CodeReview', 'DeployBot', 'TestRunner', 'LogAnalyzer', 'SchemaDesigner'],
    keywords: ['code', 'develop', 'debug', 'deploy', 'build', 'test'],
  },
  {
    tag: 'cloud',
    color: 'bae6fd/0c4a6e',
    names: ['CloudSync', 'BackupMaster', 'StorageManager', 'FileSync', 'DataVault', 'CloudBackup', 'SyncHub', 'RestorePoint', 'CloudDrive', 'ArchiveManager'],
    keywords: ['cloud', 'sync', 'backup', 'store', 'restore', 'data'],
  },
  {
    tag: 'creative',
    color: 'e9d5ff/4c1d95',
    names: ['PhotoStudio', 'VideoMaster', 'AudioEdit', 'DesignHub', 'VectorDraw', 'MediaManager', 'AnimationStudio', 'ScreenRecorder', 'FontManager', 'ColorPalette'],
    keywords: ['creative', 'design', 'photo', 'video', 'media', 'art'],
  },
  {
    tag: 'system',
    color: 'e5e7eb/111827',
    names: ['SystemOptimizer', 'DiskCleaner', 'MemoryBooster', 'ProcessMonitor', 'DiskRecovery', 'DriverManager', 'StartupManager', 'BatteryOptimizer', 'HardwareMonitor', 'SystemCleaner'],
    keywords: ['system', 'optimize', 'clean', 'monitor', 'performance', 'speed'],
  },
  {
    tag: 'communication',
    color: '99f6e4/134e4a',
    names: ['MailManager', 'TeamChat', 'VideoConference', 'VoiceConnect', 'ContactManager', 'MeetingHub', 'NotifyManager', 'BroadcastStudio', 'SecureChat', 'GroupConnect'],
    keywords: ['communicate', 'message', 'call', 'team', 'collaborate', 'conference'],
  },
  {
    tag: 'database',
    color: 'fed7aa/7c2d12',
    names: ['SQLManager', 'NoSQLBrowser', 'DataMigrator', 'QueryBuilder', 'DatabaseMonitor', 'DataAnalyzer', 'BackupSQL', 'ETLManager', 'DataVisualizer', 'SchemaSync'],
    keywords: ['database', 'query', 'data', 'analyze', 'migrate', 'schema'],
  },
  {
    tag: 'network',
    color: 'c7d2fe/1e1b4b',
    names: ['NetworkMonitor', 'TrafficAnalyzer', 'BandwidthManager', 'DNSManager', 'NetworkScanner', 'WiFiManager', 'ProxyManager', 'LoadBalancer', 'NetworkMapper', 'RemoteConnect'],
    keywords: ['network', 'connect', 'traffic', 'bandwidth', 'monitor', 'remote'],
  },
  {
    tag: 'business',
    color: 'fef08a/713f12',
    names: ['InvoiceMaster', 'ExpenseManager', 'InventoryManager', 'CRMStudio', 'HRManager', 'PayrollPro', 'ContractManager', 'BudgetTracker', 'ReportingHub', 'ERPManager'],
    keywords: ['business', 'manage', 'track', 'report', 'enterprise', 'workflow'],
  },
];

const EDITIONS = ['Pro', 'Enterprise', 'Advanced', 'Professional', 'Ultimate', 'Studio', 'Plus', 'Business', 'Team', 'Personal'];
const VERSIONS = ['2024.1', '2024.2', '2025.1', '2025.2', '3.0', '4.1', '5.0', '2.5', '6.2', '1.9'];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPrice(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function buildProduct(categoryIndex: number, nameIndex: number): Partial<Product> {
  const cat = CATEGORIES[categoryIndex];
  const baseName = cat.names[nameIndex];
  const edition = EDITIONS[(categoryIndex * 10 + nameIndex) % EDITIONS.length];
  const kw1 = cat.keywords[nameIndex % cat.keywords.length];
  const kw2 = cat.keywords[(nameIndex + 2) % cat.keywords.length];
  // Cross-pollinate keywords from adjacent category for overlap
  const crossCat = CATEGORIES[(categoryIndex + 1) % CATEGORIES.length];
  const crossKw = crossCat.keywords[nameIndex % crossCat.keywords.length];

  const price = randomPrice(9.99, 299.99);
  const hasDiscount = Math.random() > 0.4;
  const listPrice = hasDiscount ? Math.round(price * 1.3 * 100) / 100 : undefined;

  const image: ProductImage = Object.assign(new ProductImage(), {
    url: `https://placehold.co/800x600/${cat.color}?text=${encodeURIComponent(baseName)}`,
    alt: `Screenshot of ${baseName} ${edition}`,
  });

  const product: Partial<Product> = {
    name: `${baseName} ${edition}`,
    version: VERSIONS[(categoryIndex + nameIndex) % VERSIONS.length],
    images: [image],
    shortDescription: `${baseName} ${edition} — professional ${kw1} and ${kw2} solution for modern teams.`,
    longDescription: `${baseName} ${edition} provides advanced ${kw1}, ${kw2}, and ${crossKw} capabilities. `
      + `Designed for professionals who need reliable ${cat.tag} tools with cloud support, ${kw1} management, `
      + `and seamless ${kw2} integration. Supports Windows, macOS and Linux.`,
    price,
    listPrice,
    inStock: Math.random() > 0.1,
    rating: new ProductRating(),
    createdAt: randomDate(new Date('2023-01-01'), new Date('2026-03-01')),
  };

  return product;
}

const USERS = [
  { name: 'Max Mustermann',  birthDate: '1980-01-15', email: 'max@agital.online',   password: 'pass1' },
  { name: 'Anna Schmidt',    birthDate: '1992-06-23', email: 'anna@agital.online',  password: 'pass2' },
  { name: 'Klaus Weber',     birthDate: '1975-11-08', email: 'klaus@agital.online', password: 'pass3' },
  { name: 'Maria Müller',    birthDate: '1988-03-30', email: 'maria@agital.online', password: 'pass4' },
  { name: 'Thomas Fischer',  birthDate: '1995-09-12', email: 'thomas@agital.online',password: 'pass5' },
];

function hashPassword(password: string): { passwordSalt: string; passwordSha512: string } {
  const passwordSalt = randomBytes(32).toString('hex');
  const passwordSha512 = createHash('sha512').update(passwordSalt + password).digest('hex');
  return { passwordSalt, passwordSha512 };
}

async function seed() {
  const orm = await MikroORM.init({
    driver: MongoDriver,
    clientUrl: process.env.MONGODB_URL ?? 'mongodb://root:password@localhost:27017/agitalsoft?authSource=admin',
    dbName: 'agitalsoft',
    entities: [Product, ProductImage, ProductRating, User],
  });

  const em = orm.em.fork();

  const collection = em.getDriver().getConnection().getCollection<Product>('product');
  await collection.deleteMany({});

  const products: Product[] = [];
  for (let c = 0; c < CATEGORIES.length; c++) {
    for (let n = 0; n < 10; n++) {
      const data = buildProduct(c, n);
      const product = em.create(Product, data as Product);
      products.push(product);
    }
  }

  await em.persistAndFlush(products);
  console.log(`Seeded ${products.length} products.`);

  const userCollection = em.getDriver().getConnection().getCollection<User>('user');
  await userCollection.deleteMany({});

  const users = USERS.map(({ name, birthDate, email, password }) =>
    em.create(User, {
      name,
      birthDate: new Date(birthDate),
      email,
      ...hashPassword(password),
    } as User),
  );
  await em.persistAndFlush(users);
  console.log(`Seeded ${users.length} users.`);

  await orm.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

import 'reflect-metadata';
import { createHash, randomBytes } from 'node:crypto';
import { MikroORM } from '@mikro-orm/core';
import { MongoDriver } from '@mikro-orm/mongodb';
import { Product } from './product/entities/product.entity';
import { ProductImage } from './product/entities/product-image.embeddable';
import { ProductRating } from './product/entities/product-rating.embeddable';
import { User } from './user/entities/user.entity';
import { Review } from './review/entities/review.entity';

const CATEGORIES = [
  {
    tag: 'security',
    names: ['SecureShield', 'CipherGuard', 'SafeNet', 'DataGuard', 'FireWall Pro', 'VPN Shield', 'PasswordVault', 'AntiThreat', 'CloudProtect', 'ThreatDetector'],
    keywords: ['security', 'protect', 'encrypt', 'safe', 'threat', 'guard'],
  },
  {
    tag: 'office',
    names: ['DocMaster', 'SpreadPro', 'PresentStudio', 'NoteSync', 'TaskManager', 'OfficeHub', 'FormBuilder', 'ReportMaster', 'CalendarSync', 'ProjectPilot'],
    keywords: ['office', 'document', 'productivity', 'collaborate', 'workspace'],
  },
  {
    tag: 'dev',
    names: ['CodeStudio', 'DebugMaster', 'BuildPipeline', 'GitManager', 'APITester', 'CodeReview', 'DeployBot', 'TestRunner', 'LogAnalyzer', 'SchemaDesigner'],
    keywords: ['code', 'develop', 'debug', 'deploy', 'build', 'test'],
  },
  {
    tag: 'cloud',
    names: ['CloudSync', 'BackupMaster', 'StorageManager', 'FileSync', 'DataVault', 'CloudBackup', 'SyncHub', 'RestorePoint', 'CloudDrive', 'ArchiveManager'],
    keywords: ['cloud', 'sync', 'backup', 'store', 'restore', 'data'],
  },
  {
    tag: 'creative',
    names: ['PhotoStudio', 'VideoMaster', 'AudioEdit', 'DesignHub', 'VectorDraw', 'MediaManager', 'AnimationStudio', 'ScreenRecorder', 'FontManager', 'ColorPalette'],
    keywords: ['creative', 'design', 'photo', 'video', 'media', 'art'],
  },
  {
    tag: 'system',
    names: ['SystemOptimizer', 'DiskCleaner', 'MemoryBooster', 'ProcessMonitor', 'DiskRecovery', 'DriverManager', 'StartupManager', 'BatteryOptimizer', 'HardwareMonitor', 'SystemCleaner'],
    keywords: ['system', 'optimize', 'clean', 'monitor', 'performance', 'speed'],
  },
  {
    tag: 'communication',
    names: ['MailManager', 'TeamChat', 'VideoConference', 'VoiceConnect', 'ContactManager', 'MeetingHub', 'NotifyManager', 'BroadcastStudio', 'SecureChat', 'GroupConnect'],
    keywords: ['communicate', 'message', 'call', 'team', 'collaborate', 'conference'],
  },
  {
    tag: 'database',
    names: ['SQLManager', 'NoSQLBrowser', 'DataMigrator', 'QueryBuilder', 'DatabaseMonitor', 'DataAnalyzer', 'BackupSQL', 'ETLManager', 'DataVisualizer', 'SchemaSync'],
    keywords: ['database', 'query', 'data', 'analyze', 'migrate', 'schema'],
  },
  {
    tag: 'network',
    names: ['NetworkMonitor', 'TrafficAnalyzer', 'BandwidthManager', 'DNSManager', 'NetworkScanner', 'WiFiManager', 'ProxyManager', 'LoadBalancer', 'NetworkMapper', 'RemoteConnect'],
    keywords: ['network', 'connect', 'traffic', 'bandwidth', 'monitor', 'remote'],
  },
  {
    tag: 'business',
    names: ['InvoiceMaster', 'ExpenseManager', 'InventoryManager', 'CRMStudio', 'HRManager', 'PayrollPro', 'ContractManager', 'BudgetTracker', 'ReportingHub', 'ERPManager'],
    keywords: ['business', 'manage', 'track', 'report', 'enterprise', 'workflow'],
  },
];

const EDITIONS = ['Pro', 'Enterprise', 'Advanced', 'Professional', 'Ultimate', 'Studio', 'Plus', 'Business', 'Team', 'Personal'];
const VERSIONS = ['2024.1', '2024.2', '2025.1', '2025.2', '3.0', '4.1', '5.0', '2.5', '6.2', '1.9'];

const REVIEW_TEXTS: Record<number, string[]> = {
  5: [
    'Hervorragendes Produkt, absolut empfehlenswert!',
    'Übertrifft alle Erwartungen. Top Qualität!',
    'Fantastisch! Einfach zu bedienen und sehr effektiv.',
    'Bestes Produkt in seiner Klasse. Volle Punktzahl!',
    'Wir nutzen es täglich und sind restlos begeistert.',
  ],
  4: [
    'Sehr gutes Produkt mit kleinem Verbesserungspotenzial.',
    'Bin sehr zufrieden, nur Kleinigkeiten könnten besser sein.',
    'Fast perfekt – gute Leistung, schöne Oberfläche.',
    'Empfehlenswert, ein Stern Abzug für die Ladezeiten.',
    'Solides Produkt mit gutem Preis-Leistungs-Verhältnis.',
  ],
  3: [
    'Durchschnittliches Produkt, erfüllt seinen Zweck.',
    'Weder gut noch schlecht – geht so.',
    'Hat seine Stärken und Schwächen, insgesamt okay.',
    'Für den Preis in Ordnung, aber nicht begeistert.',
    'Mittelmäßig – hab schon Besseres gesehen.',
  ],
  2: [
    'Leider unter meinen Erwartungen geblieben.',
    'Einige Funktionen fehlen, andere funktionieren nicht richtig.',
    'Hatte mehr erwartet. Bin enttäuscht.',
    'Zu viele Probleme in der täglichen Nutzung.',
    'Preis steht nicht im Verhältnis zur Qualität.',
  ],
  1: [
    'Absolut unbrauchbar! Geld raus, Zeit verloren.',
    'Katastrophale Erfahrung – sofort deinstalliert.',
    'Finger weg! Funktioniert nicht wie beschrieben.',
    'Schlimmste Software die ich je benutzt habe.',
    'Totalausfall, keinerlei Empfehlung.',
  ],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPrice(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomStars(): number {
  const r = Math.random();
  if (r < 0.05) return 1;
  if (r < 0.12) return 2;
  if (r < 0.25) return 3;
  if (r < 0.55) return 4;
  return 5;
}

function buildProduct(categoryIndex: number, nameIndex: number): Partial<Product> {
  const cat = CATEGORIES[categoryIndex];
  const baseName = cat.names[nameIndex];
  const edition = EDITIONS[(categoryIndex * 10 + nameIndex) % EDITIONS.length];
  const kw1 = cat.keywords[nameIndex % cat.keywords.length];
  const kw2 = cat.keywords[(nameIndex + 2) % cat.keywords.length];
  const crossCat = CATEGORIES[(categoryIndex + 1) % CATEGORIES.length];
  const crossKw = crossCat.keywords[nameIndex % crossCat.keywords.length];

  const price = randomPrice(9.99, 299.99);
  const hasDiscount = Math.random() > 0.4;
  const listPrice = hasDiscount ? Math.round(price * 1.3 * 100) / 100 : undefined;

  const image: ProductImage = Object.assign(new ProductImage(), {
    url: `https://picsum.photos/seed/${encodeURIComponent(baseName)}/800/600`,
    alt: `Screenshot von ${baseName} ${edition}`,
  });

  return {
    name: `${baseName} ${edition}`,
    version: VERSIONS[(categoryIndex + nameIndex) % VERSIONS.length],
    images: [image],
    shortDescription: `${baseName} ${edition} — professionelle ${kw1}- und ${kw2}-Lösung für moderne Teams.`,
    longDescription: `${baseName} ${edition} bietet erweiterte Funktionen für ${kw1}, ${kw2} und ${crossKw}. `
      + `Entwickelt für Profis, die zuverlässige ${cat.tag}-Tools mit Cloud-Unterstützung, ${kw1}-Verwaltung `
      + `und nahtloser ${kw2}-Integration benötigen. Unterstützt Windows, macOS und Linux.`,
    price,
    listPrice,
    inStock: Math.random() > 0.1,
    rating: new ProductRating(),
    createdAt: randomDate(new Date('2023-01-01'), new Date('2026-03-01')),
  };
}

const USERS = [
  { name: 'Max Mustermann',  birthDate: '1980-01-15', email: 'max@agital.online',    password: 'pass1' },
  { name: 'Anna Schmidt',    birthDate: '1992-06-23', email: 'anna@agital.online',   password: 'pass2' },
  { name: 'Klaus Weber',     birthDate: '1975-11-08', email: 'klaus@agital.online',  password: 'pass3' },
  { name: 'Maria Müller',    birthDate: '1988-03-30', email: 'maria@agital.online',  password: 'pass4' },
  { name: 'Thomas Fischer',  birthDate: '1995-09-12', email: 'thomas@agital.online', password: 'pass5' },
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
    entities: [Product, ProductImage, ProductRating, User, Review],
  });

  const em = orm.em.fork();

  const collection = em.getDriver().getConnection().getCollection<Product>('product');
  await collection.deleteMany({});

  const products: Product[] = [];
  for (let c = 0; c < CATEGORIES.length; c++) {
    for (let n = 0; n < 10; n++) {
      products.push(em.create(Product, buildProduct(c, n) as Product));
    }
  }
  await em.persistAndFlush(products);
  console.log(`Seeded ${products.length} products.`);

  await collection.createIndex(
    { name: 'text', shortDescription: 'text', longDescription: 'text' },
    { weights: { name: 3, shortDescription: 2, longDescription: 1 }, name: 'product_text_idx' },
  );
  console.log('Created text index.');

  const userCollection = em.getDriver().getConnection().getCollection<User>('user');
  await userCollection.deleteMany({});

  const users = USERS.map(({ name, birthDate, email, password }) =>
    em.create(User, { name, birthDate: new Date(birthDate), email, ...hashPassword(password) } as User),
  );
  await em.persistAndFlush(users);
  console.log(`Seeded ${users.length} users.`);

  // Reviews:
  // products 0-39:  all 5 users
  // products 40-59: last 3 users [2,3,4]
  // products 60-79: last 1 user  [4]
  // products 80-99: no reviews

  const reviewCollection = em.getDriver().getConnection().getCollection('review');
  await reviewCollection.deleteMany({});

  const reviews: Review[] = [];

  function addReview(product: Product, user: User, stars: number) {
    const review = em.create(Review, {
      productId: product.id,
      userId: user.id,
      name: user.name,
      stars,
      text: pick(REVIEW_TEXTS[stars]),
      createdAt: randomDate(new Date('2023-06-01'), new Date('2026-03-01')),
    } as Review);
    reviews.push(review);

    product.rating.totalStars += stars;
    product.rating.reviewCount += 1;
    product.rating.averageRating = product.rating.totalStars / product.rating.reviewCount;
  }

  for (let i = 0; i < 40; i++) {
    for (const user of users) addReview(products[i], user, randomStars());
  }
  for (let i = 40; i < 60; i++) {
    for (const user of users.slice(2)) addReview(products[i], user, randomStars());
  }
  for (let i = 60; i < 80; i++) {
    addReview(products[i], users[4], randomStars());
  }

  await em.persistAndFlush(reviews);
  console.log(`Seeded ${reviews.length} reviews.`);

  // Persist updated product ratings
  await em.flush();
  console.log('Updated product ratings.');

  await orm.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

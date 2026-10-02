/**
 * Bagy Shop - Core Application Logic
 * اتصال به پایگاه داده Supabase v2
 * شامل بارگذاری محصولات، ثبت سفارش، پنل مدیریت و سیستم سبد خرید
 */

// ==========================================
// ۱. تنظیمات و مقداردهی اولیه کلاینت Supabase
// ==========================================
const SUPABASE_URL = 'https://vjjwoggibudsirhqabyr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqandvZ2dpYnVkc2lyaHFhYnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4Mjg0NDIsImV4cCI6MjEwNjQwNDQ0Mn0.BgkGLbMNYy6SGp9UgKnDuAq_g4ZjSrIqfFEs_d2EokA';

// ساخت کلاینت سوپابیس با تابع کمکی جهت جلوگیری از تداخل با متغیر سراسری supabase کتابخانه
var supabaseClient = null;
function getSupabase() {
  if (!supabaseClient && window.supabase && typeof window.supabase.createClient === 'function') {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseClient;
}

// داده‌های پیش‌فرض جهت Fallback در صورت قطعی اینترنت یا خطای شبکه
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    title: 'کلاه کپ اسپرت مینیمال Bagy',
    category: 'کلاه',
    price: 380000,
    image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80',
    description: 'کلاه کپ با پارچه کتان ۱۰۰٪ شسته‌شده، بند تنظیم فلزی ضدزنگ و نقاب استاندارد با طراحی اختصاصی بگی شاپ برای استایل‌های مدرن و روزمره.',
    status: 'active',
    rating: 4.9,
    review_count: 38,
    is_featured: true,
    stock: 15
  },
  {
    id: 2,
    title: 'کلاه بافت لوکس زمستانه پشمی',
    category: 'کلاه',
    price: 450000,
    image_url: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&q=80',
    description: 'بافت دولایه با الیاف گرم مرینوس، بسیار لطیف و بدون حساسیت پوستی، مناسب برای فصل سرما با پلاک اختصاصی چرمی برند.',
    status: 'active',
    rating: 4.8,
    review_count: 24,
    is_featured: false,
    stock: 20
  },
  {
    id: 3,
    title: 'کلاه باکت هت (Bucket Hat) استریت استایل',
    category: 'کلاه',
    price: 490000,
    image_url: 'https://images.unsplash.com/photo-1533055640609-24b498dfd74c?w=800&q=80',
    description: 'کلاه باکت هت مدرن دورو با دوخت دوبل، مقاوم در برابر باد و اشعه آفتاب، محبوب نسل جوان و استایل‌های خیابانی خاص.',
    status: 'active',
    rating: 4.7,
    review_count: 19,
    is_featured: false,
    stock: 8
  },
  {
    id: 4,
    title: 'کیف کمری مردانه تاکتیکال ضدآب نایلون',
    category: 'کیف کمری مردانه',
    price: 690000,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    description: 'ساخته شده از پارچه کوردیورا ضدآب فوق‌العاده مقاوم در برابر سایش با زیپ‌های روان YKK، دارای ۳ محفظه مجزا و جاکلیدی داخلی.',
    status: 'active',
    rating: 4.9,
    review_count: 52,
    is_featured: true,
    stock: 12
  },
  {
    id: 5,
    title: 'کیف کمری مردانه چرم طبیعی دست‌دوز',
    category: 'کیف کمری مردانه',
    price: 1250000,
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    description: 'چرم گاوی فلوتر اصیل با یراق‌آلات دودی مات رنگ ثابت، طراحی ارگونومیک برای استفاده بر روی شانه یا دور کمر با دوخت ابریشمی.',
    status: 'active',
    rating: 5.0,
    review_count: 31,
    is_featured: true,
    stock: 5
  },
  {
    id: 6,
    title: 'کیف دوشی و کمری کراس‌بادی شهری Bagy',
    category: 'کیف کمری مردانه',
    price: 850000,
    image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
    description: 'قابلیت استفاده دوگانه به عنوان کیف کمری و کراس‌بادی رو دوشی با بند بالشتک‌دار ضدتعریق و خروجی هندزفری.',
    status: 'active',
    rating: 4.8,
    review_count: 40,
    is_featured: false,
    stock: 9
  },
  {
    id: 7,
    title: 'کیف دستی و دوشی زنانه چرم الگانس',
    category: 'کیف زنانه',
    price: 1890000,
    image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
    description: 'کیف چرم الگانت با قفل مگنتی آبکاری طلایی و آستر سوییت ترک. دارای بند بلند جداشونده و فضای کافی برای وسایل ضروری و تلفن همراه.',
    status: 'active',
    rating: 4.9,
    review_count: 67,
    is_featured: true,
    stock: 7
  },
  {
    id: 8,
    title: 'کیف باگت زنانه مینیمال نایت کالکشن',
    category: 'کیف زنانه',
    price: 1450000,
    image_url: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80',
    description: 'طراحی وینتیج ترند با ساختار مستحکم و فرم هلالی، مناسب استفاده در مجالس و مهمانی‌ها با بند شیک کوتاه و بلند.',
    status: 'active',
    rating: 4.8,
    review_count: 43,
    is_featured: false,
    stock: 14
  },
  {
    id: 9,
    title: 'کیف توت بگ بزرگ زنانه پرکتیکال',
    category: 'کیف زنانه',
    price: 1650000,
    image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
    description: 'کیف جادار و سبک مناسب محیط کار، دانشگاه و سفر با جیب اختصاصی تبلت و محفظه زیپ‌دار میانی.',
    status: 'active',
    rating: 4.9,
    review_count: 28,
    is_featured: false,
    stock: 11
  }
];

// وضعیت برنامه‌نویسی (State)
let products = [];
let currentCategory = 'all';
let currentSort = 'newest';
let cart = [];
let wishlist = [];
let adminOrders = [];
let isLoadingProducts = false;

// کلید مجاز ذخیره‌سازی محلی برای سبد خرید مهمان (تنها استثنا طبق دستور کاربر)
const CART_STORAGE_KEY = 'bagy_shop_cart';
const WISHLIST_STORAGE_KEY = 'bagy_shop_wishlist';

// مقداردهی اولیه پس از بارگذاری صفحه
document.addEventListener('DOMContentLoaded', async () => {
  // پاکسازی هرگونه اطلاعات قدیمی محصولات و سفارشات در LocalStorage برای تطابق با دستور
  try {
    localStorage.removeItem('bagy_shop_products');
    localStorage.removeItem('bagy_shop_orders');
  } catch (e) {
    console.error(e);
  }

  // بارگذاری سبد خرید و لیست علاقه‌مندی از حافظه موقت مرورگر
  loadCartFromStorage();
  loadWishlistFromStorage();

  // بارگذاری محصولات از دیتابیس Supabase
  await loadProducts();

  updateCartUI();
  updateWishlistUI();
  setupHashRouting();
  refreshLucideIcons();
});

// ==========================================
// ۲. تابع بارگذاری محصولات از Supabase
// ==========================================
async function loadProducts() {
  isLoadingProducts = true;
  renderProductsSkeleton();

  const client = getSupabase();

  try {
    if (!client) throw new Error('Supabase client not initialized');

    // دریافت مستقیم محصولات از جدول products دیتابیس Supabase
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    if (data && data.length > 0) {
      // فقط محصولات فعال قابل خرید در دسته‌های کلاه، کیف کمری و کیف زنانه نمایش داده شوند
      // محصولات تیشرت، شلوار و کفش که قیمت‌گذاری شده بودند کاملاً از ویترین خرید فیلتر می‌شوند
      const validItems = data.filter(item => {
        const cat = String(item.category || '').toLowerCase();
        const isExcluded = ['tshirt', 'pants', 'shoes', 'تیشرت', 'شلوار', 'کفش'].some(ex => cat.includes(ex));
        return item.status === 'active' && !isExcluded;
      });

      // نرمال‌سازی ستون‌های دریافتی از جدول products
      products = validItems.map(item => ({
        id: item.id,
        title: item.title,
        category: normalizeCategory(item.category),
        price: Number(item.price) || 0,
        image: item.image_url || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
        secondaryImage: item.image_url,
        description: item.description || '',
        status: item.status || 'active',
        rating: Number(item.rating) || 4.9,
        reviewsCount: Number(item.review_count) || 15,
        badge: item.is_featured ? 'ویژه' : (item.status === 'new' ? 'جدید' : ''),
        stock: item.stock !== undefined ? Number(item.stock) : 10,
        colors: ['مشکی لوکس', 'طبیعی'],
        sizes: ['استاندارد']
      }));
    } else {
      // اگر دیتابیس هنوز خالی است، محصولات اولیه Fallback را قرار می‌دهیم
      products = FALLBACK_PRODUCTS.map(item => ({
        ...item,
        category: normalizeCategory(item.category),
        image: item.image_url,
        secondaryImage: item.image_url,
        reviewsCount: item.review_count,
        badge: item.is_featured ? 'ویژه' : '',
        colors: ['مشکی لوکس', 'طبیعی'],
        sizes: ['استاندارد']
      }));
    }
  } catch (err) {
    console.error('خطا در دریافت اطلاعات از Supabase:', err);
    showToast('خطا در ارتباط با سرور، لطفاً دوباره تلاش کنید.', 'error');
    
    // بازگشت به محصولات پیش‌فرض
    products = FALLBACK_PRODUCTS.map(item => ({
      ...item,
      image: item.image_url,
      secondaryImage: item.image_url,
      reviewsCount: item.review_count,
      badge: item.is_featured ? 'ویژه' : '',
      colors: ['مشکی لوکس', 'طبیعی'],
      sizes: ['استاندارد']
    }));
  } finally {
    isLoadingProducts = false;
    renderProducts();
    updateCategoryCounts();
  }
}

// اسکلتون لودینگ (Skeleton) در زمان بارگذاری محصولات
function renderProductsSkeleton() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  grid.innerHTML = Array(4).fill(0).map(() => `
    <div class="animate-pulse bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs">
      <div class="aspect-square bg-slate-200 rounded-xl mb-3"></div>
      <div class="h-3 bg-slate-200 rounded-full w-1/3 mb-2"></div>
      <div class="h-4 bg-slate-200 rounded-full w-3/4 mb-3"></div>
      <div class="h-5 bg-slate-200 rounded-full w-1/2 mb-4"></div>
      <div class="h-10 bg-slate-200 rounded-xl w-full"></div>
    </div>
  `).join('');
}

// نرمال‌سازی نام دسته‌بندی‌ها به فارسی استاندارد
function normalizeCategory(cat) {
  if (!cat) return 'سایر';
  const c = String(cat).trim().toLowerCase();
  if (c === 'hat' || c === 'کلاه') return 'کلاه';
  if (c === 'men_waist_bag' || c === 'کیف کمری مردانه' || c.includes('waist')) return 'کیف کمری مردانه';
  if (c === 'women_bag' || c === 'کیف زنانه' || c.includes('women')) return 'کیف زنانه';
  return cat;
}

// فرمت‌بندی سه‌رقمی قیمت‌ها و اعداد به فارسی
function formatPrice(num) {
  if (num === null || num === undefined) return '۰ تومان';
  return Number(num).toLocaleString('fa-IR') + ' تومان';
}

function formatNumber(num) {
  if (num === null || num === undefined) return '۰';
  return Number(num).toLocaleString('fa-IR');
}

// تازه‌سازی آیکون‌های Lucide
function refreshLucideIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

// فیلتر دسته‌بندی
function filterCategory(category) {
  currentCategory = category;
  
  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.classList.remove('bg-teal-700', 'text-white', 'shadow-sm', 'font-bold');
    btn.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200');
  });

  const activeBtn = document.getElementById(`cat-btn-${category}`);
  if (activeBtn) {
    activeBtn.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-200');
    activeBtn.classList.add('bg-teal-700', 'text-white', 'shadow-sm', 'font-bold');
  }

  renderProducts();

  const section = document.getElementById('products-section');
  if (section && window.scrollY < section.offsetTop - 120) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

function handleSortChange(sortType) {
  currentSort = sortType;
  renderProducts();
}

function updateCategoryCounts() {
  const allCount = products.length;
  const hatCount = products.filter(p => p.category === 'کلاه').length;
  const waistCount = products.filter(p => p.category === 'کیف کمری مردانه').length;
  const womenCount = products.filter(p => p.category === 'کیف زنانه').length;

  const countAll = document.getElementById('count-all');
  const countHat = document.getElementById('count-کلاه');
  const countWaist = document.getElementById('count-کیف کمری مردانه');
  const countWomen = document.getElementById('count-کیف زنانه');

  if (countAll) countAll.innerText = formatNumber(allCount);
  if (countHat) countHat.innerText = formatNumber(hatCount);
  if (countWaist) countWaist.innerText = formatNumber(waistCount);
  if (countWomen) countWomen.innerText = formatNumber(womenCount);
}

// رندر گرید محصولات
function renderProducts() {
  if (isLoadingProducts) return;

  const grid = document.getElementById('products-grid');
  const emptyMsg = document.getElementById('no-products-msg');
  if (!grid) return;

  let filtered = products.filter(p => {
    if (currentCategory === 'all') return true;
    return p.category === currentCategory;
  });

  if (currentSort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'popular') {
    filtered.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyMsg) emptyMsg.classList.remove('hidden');
    return;
  }

  if (emptyMsg) emptyMsg.classList.add('hidden');

  grid.innerHTML = filtered.map(item => {
    const isWishlisted = wishlist.includes(String(item.id));
    return `
      <div class="group bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1 relative">
        
        <!-- جعبه تصویر با تعویض نرم در هاور -->
        <div class="relative aspect-square rounded-xl overflow-hidden bg-slate-100 mb-3 cursor-pointer" onclick="openProductDetail('${item.id}')">
          <img 
            src="${item.image}" 
            alt="${item.title}" 
            loading="lazy" 
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <!-- برچسب ویژه یا جدید -->
          ${item.badge ? `
            <span class="absolute top-2.5 right-2.5 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs ${
              item.badge === 'جدید' ? 'bg-teal-600 text-white' :
              item.badge === 'تخفیف' ? 'bg-red-500 text-white' :
              'bg-amber-400 text-slate-900'
            }">
              ${item.badge}
            </span>
          ` : ''}

          <!-- دکمه علاقه‌مندی -->
          <button 
            onclick="event.stopPropagation(); toggleWishlist('${item.id}')" 
            aria-label="افزودن به علاقه‌مندی‌ها"
            class="absolute top-2.5 left-2.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-xs flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer ${isWishlisted ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}"
          >
            <i data-lucide="heart" class="w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}"></i>
          </button>
        </div>

        <!-- جزئیات متنی و قیمت -->
        <div class="px-1 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>${item.category}</span>
              <div class="flex items-center gap-1 text-amber-500 font-bold">
                <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i>
                <span>${formatNumber(item.rating || 4.9)}</span>
              </div>
            </div>

            <h3 onclick="openProductDetail('${item.id}')" class="text-sm font-bold text-slate-800 line-clamp-2 hover:text-teal-700 transition cursor-pointer mb-2">
              ${item.title}
            </h3>
          </div>

          <div class="pt-2 border-t border-slate-100">
            <div class="text-base font-black text-slate-900 mb-3">
              ${formatPrice(item.price)}
            </div>

            <!-- دکمه افزودن سریع به سبد خرید -->
            <button 
              onclick="addToCart('${item.id}')" 
              class="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs hover:shadow-md"
            >
              <i data-lucide="shopping-cart" class="w-4 h-4"></i>
              <span>افزودن به سبد خرید</span>
            </button>
          </div>
        </div>

      </div>
    `;
  }).join('');

  refreshLucideIcons();
}

// مودال جزئیات محصول
let selectedModalColor = '';
let selectedModalSize = '';
let selectedModalQty = 1;

function openProductDetail(productId) {
  const item = products.find(p => String(p.id) === String(productId));
  if (!item) return;

  selectedModalColor = (item.colors && item.colors[0]) || 'مشکی';
  selectedModalSize = (item.sizes && item.sizes[0]) || 'فری‌سایز';
  selectedModalQty = 1;

  const modal = document.getElementById('product-modal');
  const container = document.getElementById('product-modal-content');

  container.innerHTML = `
    <button onclick="closeProductDetail()" class="absolute top-5 left-5 z-20 w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition">
      <i data-lucide="x" class="w-5 h-5"></i>
    </button>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-10">
      
      <!-- تصویر بزرگ محصول -->
      <div class="space-y-4">
        <div class="aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-md">
          <img id="detail-main-img" src="${item.image}" alt="${item.title}" class="w-full h-full object-cover" />
        </div>
        <div class="flex items-center gap-3">
          <div class="w-20 h-20 rounded-xl overflow-hidden border-2 border-teal-600">
            <img src="${item.image}" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <!-- اطلاعات و انتخاب مشخصات -->
      <div class="flex flex-col justify-between space-y-6">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">${item.category}</span>
            <div class="flex items-center gap-1 text-amber-500 text-xs font-bold">
              <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
              <span>${formatNumber(item.rating)} (${formatNumber(item.reviewsCount)} نظر ثبت شده)</span>
            </div>
            ${item.stock !== undefined ? `<span class="text-[11px] text-slate-500 mr-auto">موجودی انبار: ${formatNumber(item.stock)} عدد</span>` : ''}
          </div>

          <h2 class="text-2xl font-black text-slate-900 leading-snug mb-3">
            ${item.title}
          </h2>

          <div class="text-2xl font-black text-teal-700 mb-4">
            ${formatPrice(item.price)}
          </div>

          <p class="text-slate-600 text-sm leading-relaxed mb-6">
            ${item.description || 'محصول دست‌ساز با بالاترین کیفیت متریال و استاندارد ارگونومی برای استایل روزمره و مجالس.'}
          </p>

          <!-- انتخاب رنگ -->
          <div class="mb-4">
            <label class="block text-xs font-bold text-slate-700 mb-2">رنگ‌بندی انتخابی:</label>
            <div class="flex flex-wrap gap-2">
              ${(item.colors || ['مشکی لوکس', 'طبیعی']).map((c, i) => `
                <button 
                  onclick="selectDetailColor('${c}', this)" 
                  class="detail-color-pill px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${i === 0 ? 'bg-teal-700 text-white border-teal-700' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}"
                >
                  ${c}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- تعداد انتخابی -->
          <div class="mb-6">
            <label class="block text-xs font-bold text-slate-700 mb-2">تعداد:</label>
            <div class="inline-flex items-center border border-slate-200 rounded-full bg-slate-50 p-1">
              <button onclick="changeDetailQty(-1)" class="w-8 h-8 rounded-full bg-white text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-base shadow-2xs">
                -
              </button>
              <span id="detail-qty" class="w-10 text-center font-bold text-sm text-slate-800">۱</span>
              <button onclick="changeDetailQty(1)" class="w-8 h-8 rounded-full bg-white text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-base shadow-2xs">
                +
              </button>
            </div>
          </div>
        </div>

        <!-- دکمه‌های عملیاتی -->
        <div class="flex items-center gap-3 pt-4 border-t border-slate-100">
          <button 
            onclick="addCustomToCart('${item.id}')" 
            class="flex-1 py-3.5 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <i data-lucide="shopping-bag" class="w-5 h-5"></i>
            <span>افزودن به سبد خرید</span>
          </button>
          
          <button 
            onclick="toggleWishlist('${item.id}')" 
            class="p-3.5 rounded-full border border-slate-200 hover:border-red-400 hover:text-red-500 text-slate-600 transition cursor-pointer"
          >
            <i data-lucide="heart" class="w-5 h-5 ${wishlist.includes(String(item.id)) ? 'fill-red-500 text-red-500' : ''}"></i>
          </button>
        </div>

      </div>

    </div>

    <!-- نظرات مشتریان -->
    <div class="border-t border-slate-100 p-6 sm:p-10 bg-slate-50 rounded-b-3xl">
      <h3 class="font-bold text-base text-slate-900 mb-4">نظرات خریداران این محصول</h3>
      <div class="space-y-3 mb-6">
        <div class="p-3 rounded-xl bg-white border border-slate-200/80 text-xs space-y-1">
          <div class="flex justify-between font-bold text-slate-800">
            <span>سارا حسینی</span>
            <span class="text-amber-500">★★★★★</span>
          </div>
          <p class="text-slate-600">کیفیت دوخت و متریال واقعاً عالی بود، دقیقا مثل تصاویر سایت و بسته‌بندی بسیار شکیل و کادویی ارسال شد.</p>
        </div>
      </div>

      <form onsubmit="handleReviewSubmit(event)" class="flex gap-2">
        <input type="text" required placeholder="نظر خود را درباره این محصول بنویسید..." class="flex-1 bg-white border border-slate-200 px-4 py-2 text-xs rounded-xl focus:outline-hidden focus:border-teal-600" />
        <button type="submit" class="px-4 py-2 bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition cursor-pointer">
          ثبت نظر
        </button>
      </form>
    </div>
  `;

  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.remove('opacity-0');
  }, 10);
  refreshLucideIcons();
}

function closeProductDetail() {
  const modal = document.getElementById('product-modal');
  modal.classList.add('opacity-0');
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 300);
}

function selectDetailColor(color, btn) {
  selectedModalColor = color;
  document.querySelectorAll('.detail-color-pill').forEach(b => {
    b.classList.remove('bg-teal-700', 'text-white', 'border-teal-700');
    b.classList.add('bg-slate-50', 'text-slate-700', 'border-slate-200');
  });
  btn.classList.remove('bg-slate-50', 'text-slate-700', 'border-slate-200');
  btn.classList.add('bg-teal-700', 'text-white', 'border-teal-700');
}

function changeDetailQty(delta) {
  selectedModalQty = Math.max(1, selectedModalQty + delta);
  const qtyElem = document.getElementById('detail-qty');
  if (qtyElem) qtyElem.innerText = formatNumber(selectedModalQty);
}

function addCustomToCart(productId) {
  addToCart(productId, selectedModalQty, selectedModalColor, selectedModalSize);
  closeProductDetail();
}

function handleReviewSubmit(e) {
  e.preventDefault();
  showToast('نظر شما با موفقیت ثبت شد و پس از بررسی تایید می‌گردد.', 'success');
  e.target.reset();
}

// ==========================================
// ۳. سیستم مدیریت سبد خرید (Guest Cart)
// ==========================================
function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) cart = JSON.parse(saved);
  } catch {
    cart = [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error(e);
  }
}

function addToCart(productId, quantity = 1, color = '', size = '') {
  const product = products.find(p => String(p.id) === String(productId));
  if (!product) return;

  const itemColor = color || (product.colors && product.colors[0]) || 'مشکی';
  const itemSize = size || (product.sizes && product.sizes[0]) || 'فری‌سایز';
  const cartItemId = `${product.id}-${itemColor}-${itemSize}`;

  const existingIndex = cart.findIndex(c => c.cartItemId === cartItemId);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      cartItemId,
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity,
      color: itemColor,
      size: itemSize
    });
  }

  saveCart();
  updateCartUI();
  showToast(`«${product.title}» به سبد خرید اضافه شد`, 'success');
}

function updateCartQuantity(cartItemId, delta) {
  const item = cart.find(c => c.cartItemId === cartItemId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(cartItemId);
    return;
  }

  saveCart();
  updateCartUI();
}

function removeFromCart(cartItemId) {
  const item = cart.find(c => c.cartItemId === cartItemId);
  cart = cart.filter(c => c.cartItemId !== cartItemId);
  saveCart();
  updateCartUI();
  if (item) {
    showToast(`«${item.title}» از سبد خرید حذف شد`, 'info');
  }
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // شرط ارسال رایگان برای خریدهای بالای ۵۰۰,۰۰۰ تومان
  const isFreeShipping = subtotal >= 500000 || totalItems === 0;
  const shippingCost = isFreeShipping ? 0 : 45000;
  const total = subtotal + shippingCost;

  // نشانگر هدر
  const badge = document.getElementById('cart-badge');
  if (badge) {
    if (totalItems > 0) {
      badge.innerText = formatNumber(totalItems);
      badge.classList.remove('hidden');
      badge.classList.add('flex');
    } else {
      badge.classList.add('hidden');
      badge.classList.remove('flex');
    }
  }

  // پنل کشویی سبد خرید
  const countElem = document.getElementById('cart-items-count');
  const subtotalElem = document.getElementById('cart-subtotal');
  const shippingElem = document.getElementById('cart-shipping');
  const totalElem = document.getElementById('cart-total');

  if (countElem) countElem.innerText = `${formatNumber(totalItems)} کالا`;
  if (subtotalElem) subtotalElem.innerText = formatPrice(subtotal);
  if (shippingElem) shippingElem.innerText = isFreeShipping ? 'رایگان' : formatPrice(shippingCost);
  if (totalElem) totalElem.innerText = formatPrice(total);

  // نوار پیشرفت ارسال رایگان
  const freeThreshold = 500000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
  const progressBar = document.getElementById('free-shipping-progress');
  const progressText = document.getElementById('free-shipping-text');
  const progressPercentText = document.getElementById('free-shipping-percent');

  if (progressBar) progressBar.style.width = `${progressPercent}%`;
  if (progressPercentText) progressPercentText.innerText = `${formatNumber(progressPercent)}٪`;

  if (progressText) {
    if (subtotal >= freeThreshold) {
      progressText.innerText = 'تبریک! ارسال سفارش شما رایگان شد 🎉';
    } else if (subtotal > 0) {
      const diff = freeThreshold - subtotal;
      progressText.innerText = `فقط ${formatPrice(diff)} تا ارسال رایگان`;
    } else {
      progressText.innerText = 'ارسال رایگان برای خریدهای بالای ۵۰۰,۰۰۰ تومان';
    }
  }

  // فهرست آیتم‌ها در سبد
  const container = document.getElementById('cart-items-container');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-16">
        <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <i data-lucide="shopping-bag" class="w-8 h-8"></i>
        </div>
        <h4 class="font-bold text-slate-800 text-base">سبد خرید شما خالی است</h4>
        <p class="text-xs text-slate-500 mt-1 mb-6">محصولات مورد علاقه خود را انتخاب کنید</p>
        <button onclick="closeCart()" class="px-6 py-2.5 bg-teal-700 text-white text-xs font-bold rounded-full hover:bg-teal-800 transition cursor-pointer">
          مشاهده محصولات فروشگاه
        </button>
      </div>
    `;
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
  } else {
    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    container.innerHTML = cart.map(item => `
      <div class="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition">
        <img src="${item.image}" alt="${item.title}" class="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200" />
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-xs text-slate-800 truncate mb-1">${item.title}</h4>
          <div class="text-[11px] text-slate-400 mb-1">
            ${item.color ? `<span>رنگ: ${item.color}</span>` : ''}
          </div>
          <div class="text-xs font-black text-teal-700">${formatPrice(item.price)}</div>
        </div>

        <div class="flex flex-col items-end gap-2">
          <button onclick="removeFromCart('${item.cartItemId}')" class="text-slate-400 hover:text-red-500 p-1 cursor-pointer">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
          <div class="flex items-center border border-slate-200 rounded-lg bg-white">
            <button onclick="updateCartQuantity('${item.cartItemId}', -1)" class="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-r-lg font-bold text-xs cursor-pointer">-</button>
            <span class="w-6 text-center text-xs font-bold">${formatNumber(item.quantity)}</span>
            <button onclick="updateCartQuantity('${item.cartItemId}', 1)" class="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-l-lg font-bold text-xs cursor-pointer">+</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  refreshLucideIcons();
}

function openCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  drawer.classList.remove('translate-x-full');
  overlay.classList.remove('opacity-0', 'pointer-events-none');
}

function closeCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  drawer.classList.add('translate-x-full');
  overlay.classList.add('opacity-0', 'pointer-events-none');
}

// لیست علاقه‌مندی‌ها
function loadWishlistFromStorage() {
  try {
    const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (saved) wishlist = JSON.parse(saved);
  } catch {
    wishlist = [];
  }
}

function toggleWishlist(productId) {
  const strId = String(productId);
  const index = wishlist.indexOf(strId);
  const product = products.find(p => String(p.id) === strId);

  if (index > -1) {
    wishlist.splice(index, 1);
    showToast(`از لیست علاقه‌مندی‌ها حذف شد`, 'info');
  } else {
    wishlist.push(strId);
    showToast(`«${product ? product.title : ''}» به علاقه‌مندی‌ها اضافه شد`, 'success');
  }

  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  updateWishlistUI();
  renderProducts();
}

function updateWishlistUI() {
  const badge = document.getElementById('wishlist-badge');
  if (badge) {
    if (wishlist.length > 0) {
      badge.innerText = formatNumber(wishlist.length);
      badge.classList.remove('hidden');
      badge.classList.add('flex');
    } else {
      badge.classList.add('hidden');
      badge.classList.remove('flex');
    }
  }

  const container = document.getElementById('wishlist-items-container');
  if (!container) return;

  if (wishlist.length === 0) {
    container.innerHTML = `
      <div class="text-center py-16">
        <div class="w-16 h-16 rounded-full bg-red-50 text-red-400 flex items-center justify-center mx-auto mb-4">
          <i data-lucide="heart" class="w-8 h-8"></i>
        </div>
        <h4 class="font-bold text-slate-800 text-base">لیست علاقه‌مندی‌ها خالی است</h4>
        <p class="text-xs text-slate-500 mt-1 mb-6">آیتم‌های دلخواه خود را علامت‌گذاری کنید</p>
      </div>
    `;
  } else {
    const items = products.filter(p => wishlist.includes(String(p.id)));
    container.innerHTML = items.map(item => `
      <div class="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/50">
        <img src="${item.image}" alt="${item.title}" class="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200" />
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-xs text-slate-800 truncate mb-1">${item.title}</h4>
          <div class="text-xs font-black text-teal-700">${formatPrice(item.price)}</div>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="addToCart('${item.id}')" class="p-2 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition cursor-pointer">
            <i data-lucide="shopping-bag" class="w-4 h-4"></i>
          </button>
          <button onclick="toggleWishlist('${item.id}')" class="p-2 text-slate-400 hover:text-red-500 transition cursor-pointer">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `).join('');
  }
  refreshLucideIcons();
}

function openWishlist() {
  const drawer = document.getElementById('wishlist-drawer');
  const overlay = document.getElementById('wishlist-overlay');
  drawer.classList.remove('translate-x-full');
  overlay.classList.remove('opacity-0', 'pointer-events-none');
}

function closeWishlist() {
  const drawer = document.getElementById('wishlist-drawer');
  const overlay = document.getElementById('wishlist-overlay');
  drawer.classList.add('translate-x-full');
  overlay.classList.add('opacity-0', 'pointer-events-none');
}

// سیستم جستجوی زنده
function openSearch() {
  const overlay = document.getElementById('search-overlay');
  const box = document.getElementById('search-box');
  const input = document.getElementById('search-input');

  overlay.classList.remove('hidden');
  setTimeout(() => {
    overlay.classList.remove('opacity-0');
    box.classList.remove('scale-95');
    box.classList.add('scale-100');
    input.focus();
  }, 10);
}

function closeSearch() {
  const overlay = document.getElementById('search-overlay');
  const box = document.getElementById('search-box');
  overlay.classList.add('opacity-0');
  box.classList.remove('scale-100');
  box.classList.add('scale-95');
  setTimeout(() => {
    overlay.classList.add('hidden');
  }, 300);
}

function handleSearch(query) {
  const container = document.getElementById('search-results');
  const q = query.trim().toLowerCase();

  if (!q) {
    container.innerHTML = '<p class="text-center text-sm text-slate-400 py-6">کلمه مورد نظر خود را تایپ کنید...</p>';
    return;
  }

  const results = products.filter(p => 
    p.title.toLowerCase().includes(q) || 
    p.category.toLowerCase().includes(q) || 
    (p.description && p.description.toLowerCase().includes(q))
  );

  if (results.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8">
        <i data-lucide="alert-circle" class="w-8 h-8 text-slate-300 mx-auto mb-2"></i>
        <p class="text-slate-600 text-sm">نتیجه‌ای برای «${query}» یافت نشد.</p>
      </div>
    `;
    refreshLucideIcons();
    return;
  }

  container.innerHTML = results.map(item => `
    <div onclick="closeSearch(); openProductDetail('${item.id}')" class="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition cursor-pointer border border-transparent hover:border-slate-200">
      <img src="${item.image}" alt="${item.title}" class="w-14 h-14 rounded-lg object-cover" />
      <div class="flex-1">
        <span class="text-[11px] text-teal-700 font-semibold">${item.category}</span>
        <h4 class="text-sm font-bold text-slate-900">${item.title}</h4>
        <span class="text-xs font-black text-slate-700">${formatPrice(item.price)}</span>
      </div>
      <i data-lucide="chevron-left" class="w-5 h-5 text-slate-400"></i>
    </div>
  `).join('');

  refreshLucideIcons();
}

// ==========================================
// ۴. تابع ثبت سفارش در دیتابیس Supabase
// ==========================================
function openCheckout() {
  closeCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const isFreeShipping = subtotal >= 500000;
  const shippingCost = isFreeShipping ? 0 : 45000;
  const total = subtotal + shippingCost;

  document.getElementById('checkout-subtotal').innerText = formatPrice(subtotal);
  document.getElementById('checkout-shipping').innerText = isFreeShipping ? 'رایگان' : formatPrice(shippingCost);
  document.getElementById('checkout-total').innerText = formatPrice(total);

  const modal = document.getElementById('checkout-modal');
  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.remove('opacity-0');
  }, 10);
}

function closeCheckout() {
  const modal = document.getElementById('checkout-modal');
  modal.classList.add('opacity-0');
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 300);
}

// ثبت نهایی سفارش در Supabase جدول orders
async function handlePlaceOrder(e) {
  e.preventDefault();
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalBtnHtml = submitBtn.innerHTML;

  const name = document.getElementById('order-name').value.trim();
  const phone = document.getElementById('order-phone').value.trim();
  const city = document.getElementById('order-city').value.trim();
  const address = document.getElementById('order-address').value.trim();
  const postal = document.getElementById('order-postal').value.trim();
  const note = document.getElementById('order-note').value.trim();

  // اعتبارسنجی شماره تماس ۱۱ رقمی ایرانی
  if (!/^09[0-9]{9}$/.test(phone)) {
    showToast('لطفاً یک شماره همراه معتبر ۱۱ رقمی وارد نمایید (مثال: ۰۹۱۲۳۴۵۶۷۸۹)', 'error');
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal >= 500000 ? 0 : 45000;
  const total = subtotal + shippingCost;

  // ساخت کد رهگیری ۸ رقمی مطابق درخواست: BGY- + 8 رقم
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
  const trackingCode = `BGY-${randomDigits}`;

  // تبدیل آیتم‌های سبد خرید به ساختار JSONB خواسته شده:
  // [{ "id": 1, "title": "کلاه بیسبال", "price": 320000, "quantity": 2, "image_url": "..." }, ...]
  const itemsJson = cart.map(item => ({
    id: item.productId,
    title: item.title,
    price: item.price,
    quantity: item.quantity,
    image_url: item.image,
    color: item.color || '',
    size: item.size || ''
  }));

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <div class="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
      <span>در حال ارتباط با سرور و ثبت سفارش...</span>
    `;

    const client = getSupabase();
    if (!client) throw new Error('Supabase client not initialized');

    // ارسال سفارش به جدول orders دیتابیس Supabase
    const { data, error } = await client
      .from('orders')
      .insert([
        {
          customer_name: name,
          phone: phone,
          address: `${city}، ${address}`,
          postal_code: postal || null,
          notes: note || null,
          items: itemsJson,
          total_amount: total,
          shipping_cost: shippingCost,
          status: 'pending',
          tracking_code: trackingCode
        }
      ])
      .select();

    if (error) {
      console.error('Supabase order insertion error:', error);
      throw error;
    }

    // خالی کردن سبد خرید بعد از ثبت موفق در دیتابیس
    cart = [];
    saveCart();
    updateCartUI();
    closeCheckout();

    // نمایش مودال موفقیت با کد رهگیری دیتابیس
    document.getElementById('order-tracking-code').innerText = trackingCode;
    const successModal = document.getElementById('order-success-modal');
    successModal.classList.remove('hidden');
    setTimeout(() => {
      successModal.classList.remove('opacity-0');
    }, 10);

    showToast(`سفارش شما با کد ${trackingCode} در سامانه ثبت شد ✨`, 'success');

  } catch (err) {
    console.error('خطا در ثبت سفارش:', err);
    showToast('خطا در ارتباط با سرور، لطفاً دوباره تلاش کنید.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnHtml;
    refreshLucideIcons();
  }
}

function closeOrderSuccess() {
  const successModal = document.getElementById('order-success-modal');
  successModal.classList.add('opacity-0');
  setTimeout(() => {
    successModal.classList.add('hidden');
  }, 300);
}

// دسته به زودی فاز ۲ - غیرقابل انتخاب و خرید
function showComingSoonToast(categoryName) {
  showToast(`دسته بندی «${categoryName}» به زودی اضافه می‌شود و در حال حاضر امکان سفارش آن وجود ندارد ⏳`, 'gold');
}

// عضویت در خبرنامه
function handleNewsletter(e) {
  e.preventDefault();
  showToast('عضویت شما در خبرنامه تخفیف‌های ویژه بگی شاپ ثبت شد ✨', 'success');
  e.target.reset();
}

// سیستم Toast مدرن
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  
  let bgClass = 'bg-slate-900 text-white border-slate-700';
  let iconName = 'info';

  if (type === 'success') {
    bgClass = 'bg-teal-800 text-white border-teal-600';
    iconName = 'check-circle';
  } else if (type === 'gold') {
    bgClass = 'bg-amber-950 text-amber-200 border-amber-600/50';
    iconName = 'sparkles';
  } else if (type === 'error') {
    bgClass = 'bg-red-700 text-white border-red-500';
    iconName = 'alert-octagon';
  }

  toast.className = `flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-medium transition-all duration-300 transform translate-y-4 opacity-0 pointer-events-auto ${bgClass}`;
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="w-5 h-5 shrink-0"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  refreshLucideIcons();

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// کنترل منوی موبایل
function toggleMobileNav() {
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-menu-overlay');
  
  if (menu.classList.contains('translate-x-full')) {
    menu.classList.remove('translate-x-full');
    overlay.classList.remove('opacity-0', 'pointer-events-none');
  } else {
    menu.classList.add('translate-x-full');
    overlay.classList.add('opacity-0', 'pointer-events-none');
  }
}

// ==========================================
// ۵. پنل مدیریت متصل به دیتابیس Supabase
// ==========================================
async function openAdmin() {
  const modal = document.getElementById('admin-modal');
  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.remove('opacity-0');
  }, 10);
  refreshLucideIcons();

  // دریافت اطلاعات زنده از Supabase
  await loadAdminProducts();
  await loadAdminOrdersAndStats();
}

function closeAdmin() {
  const modal = document.getElementById('admin-modal');
  modal.classList.add('opacity-0');
  setTimeout(() => {
    modal.classList.add('hidden');
    if (window.location.hash === '#admin') {
      history.replaceState(null, null, ' ');
    }
  }, 300);
}

function switchAdminTab(tabName) {
  const viewProducts = document.getElementById('admin-view-products');
  const viewAdd = document.getElementById('admin-view-add');
  const viewOrders = document.getElementById('admin-view-orders');
  const viewAnalytics = document.getElementById('admin-view-analytics');

  const tabP = document.getElementById('admin-tab-products');
  const tabA = document.getElementById('admin-tab-add');
  const tabO = document.getElementById('admin-tab-orders');
  const tabAn = document.getElementById('admin-tab-analytics');

  [tabP, tabA, tabO, tabAn].forEach(t => {
    if (t) t.className = 'py-3 px-4 font-medium text-sm text-slate-600 hover:text-slate-900 cursor-pointer whitespace-nowrap';
  });

  if (viewProducts) viewProducts.classList.add('hidden');
  if (viewAdd) viewAdd.classList.add('hidden');
  if (viewOrders) viewOrders.classList.add('hidden');
  if (viewAnalytics) viewAnalytics.classList.add('hidden');

  if (tabName === 'products') {
    if (tabP) tabP.className = 'py-3 px-4 font-bold text-sm text-teal-700 border-b-2 border-teal-700 cursor-pointer whitespace-nowrap';
    if (viewProducts) viewProducts.classList.remove('hidden');
    loadAdminProducts();
  } else if (tabName === 'add') {
    if (tabA) tabA.className = 'py-3 px-4 font-bold text-sm text-teal-700 border-b-2 border-teal-700 cursor-pointer whitespace-nowrap';
    if (viewAdd) viewAdd.classList.remove('hidden');
  } else if (tabName === 'orders') {
    if (tabO) tabO.className = 'py-3 px-4 font-bold text-sm text-teal-700 border-b-2 border-teal-700 cursor-pointer whitespace-nowrap';
    if (viewOrders) viewOrders.classList.remove('hidden');
    loadAdminOrdersAndStats();
  } else if (tabName === 'analytics') {
    if (tabAn) tabAn.className = 'py-3 px-4 font-bold text-sm text-teal-700 border-b-2 border-teal-700 cursor-pointer whitespace-nowrap';
    if (viewAnalytics) viewAnalytics.classList.remove('hidden');
    loadAdminOrdersAndStats();
  }
}

// دریافت و نمایش محصولات در پنل مدیریت از Supabase
async function loadAdminProducts() {
  const tbody = document.getElementById('admin-products-table-body');
  if (!tbody) return;

  tbody.innerHTML = `
    <tr>
      <td colspan="6" class="text-center py-6 text-slate-400">
        <div class="inline-block animate-spin rounded-full h-5 w-5 border-2 border-teal-700 border-t-transparent mr-2"></div>
        در حال بارگذاری لیست محصولات از سرور...
      </td>
    </tr>
  `;

  try {
    const client = getSupabase();
    if (!client) throw new Error('Supabase client not initialized');

    const { data, error } = await client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const list = data || [];
    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-8 text-slate-400">
            هنوز محصولی در پایگاه داده ثبت نشده است. 
            <button onclick="seedInitialProductsToSupabase()" class="mr-2 px-3 py-1 bg-teal-700 text-white text-xs rounded-lg hover:bg-teal-800 transition">
              بارگذاری محصولات پیش‌فرض در دیتابیس
            </button>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map(p => `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100">
        <td class="p-3">
          <img src="${p.image_url || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'}" class="w-12 h-12 rounded-lg object-cover" />
        </td>
        <td class="p-3 font-bold text-slate-800">${p.title}</td>
        <td class="p-3 text-slate-600">${p.category}</td>
        <td class="p-3 font-black text-teal-700">${formatPrice(p.price)}</td>
        <td class="p-3">
          <span class="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">${p.status === 'active' ? 'فعال' : p.status}</span>
        </td>
        <td class="p-3 text-center">
          <button onclick="adminDeleteProduct('${p.id}')" title="حذف از Supabase" class="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition cursor-pointer">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </td>
      </tr>
    `).join('');

    refreshLucideIcons();
  } catch (err) {
    console.error('Error loading admin products:', err);
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-6 text-red-500 text-xs">
          خطا در ارتباط با سرور، لطفاً دوباره تلاش کنید.
        </td>
      </tr>
    `;
  }
}

// افزودن محصول جدید به دیتابیس Supabase
async function handleAdminAddProduct(e) {
  e.preventDefault();
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;

  const title = document.getElementById('admin-p-title').value.trim();
  const category = document.getElementById('admin-p-cat').value;
  const price = parseInt(document.getElementById('admin-p-price').value, 10);
  const image_url = document.getElementById('admin-p-image').value.trim();
  const description = document.getElementById('admin-p-desc').value.trim();

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'در حال ذخیره در دیتابیس...';

    const client = getSupabase();
    if (!client) throw new Error('Supabase client not initialized');

    // ذخیره در جدول products با ساختار تعریف شده
    const { data, error } = await client
      .from('products')
      .insert([
        {
          title,
          category,
          price,
          image_url,
          description: description || 'محصول انحصاری و باکیفیت بگی شاپ.',
          status: 'active',
          rating: 5.0,
          review_count: 1,
          is_featured: true,
          stock: 10
        }
      ])
      .select();

    if (error) throw error;

    showToast(`محصول «${title}» با موفقیت در Supabase ذخیره شد!`, 'success');
    e.target.reset();

    // به‌روزرسانی خودکار کاتالوگ فروشگاه و پنل مدیریت
    await loadProducts();
    switchAdminTab('products');

  } catch (err) {
    console.error('Error adding product to Supabase:', err);
    showToast('خطا در ارتباط با سرور، لطفاً دوباره تلاش کنید.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

// حذف محصول از Supabase با شناسه
async function adminDeleteProduct(productId) {
  if (!confirm('آیا از حذف دائم این محصول از دیتابیس اطمینان دارید؟')) return;

  try {
    const client = getSupabase();
    if (!client) throw new Error('Supabase client not initialized');

    const { error } = await client
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;

    showToast('محصول با موفقیت از پایگاه داده حذف شد.', 'info');
    
    // رفرش همزمان داده‌ها
    await loadProducts();
    await loadAdminProducts();

  } catch (err) {
    console.error('Error deleting product:', err);
    showToast('خطا در ارتباط با سرور، لطفاً دوباره تلاش کنید.', 'error');
  }
}

// خواندن سفارشات و آمار از Supabase
async function loadAdminOrdersAndStats() {
  const ordersContainer = document.getElementById('admin-orders-list');
  const statProducts = document.getElementById('stat-total-products');
  const statOrders = document.getElementById('stat-total-orders');
  const statRev = document.getElementById('stat-total-revenue');

  try {
    const client = getSupabase();
    if (!client) throw new Error('Supabase client not initialized');

    // دریافت سفارشات از جدول orders سوپابیس
    const { data: ordersData, error: ordersError } = await client
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;

    adminOrders = ordersData || [];

    // محاسبه آمار
    if (statProducts) statProducts.innerText = formatNumber(products.length);
    if (statOrders) statOrders.innerText = formatNumber(adminOrders.length);

    const totalRev = adminOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
    if (statRev) statRev.innerText = formatPrice(totalRev);

    // رندر لیست سفارشات
    if (ordersContainer) {
      if (adminOrders.length === 0) {
        ordersContainer.innerHTML = '<p class="text-xs text-slate-400 py-6 text-center">هنوز سفارشی در دیتابیس ثبت نشده است.</p>';
      } else {
        ordersContainer.innerHTML = adminOrders.map(ord => {
          let itemsList = [];
          if (Array.isArray(ord.items)) {
            itemsList = ord.items;
          } else if (typeof ord.items === 'string') {
            try { itemsList = JSON.parse(ord.items); } catch { itemsList = []; }
          }

          return `
            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
              <div class="flex justify-between items-center font-bold text-slate-800">
                <span class="text-teal-700">کد رهگیری: ${ord.tracking_code || ord.id}</span>
                <span class="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">${ord.status || 'pending'}</span>
                <span class="text-slate-900 font-black">${formatPrice(ord.total_amount)}</span>
              </div>
              <div class="text-slate-600">
                <strong>گیرنده:</strong> ${ord.customer_name} | <strong>تلفن:</strong> <span dir="ltr">${ord.phone}</span>
              </div>
              <div class="text-slate-500">
                <strong>آدرس:</strong> ${ord.address || '—'} ${ord.postal_code ? `(کدپستی: ${ord.postal_code})` : ''}
              </div>
              ${ord.notes ? `<div class="text-slate-400 italic">یادداشت: ${ord.notes}</div>` : ''}
              <div class="pt-2 border-t border-slate-200 text-slate-600 flex flex-wrap gap-2">
                <strong>اقلام:</strong>
                ${itemsList.map(it => `
                  <span class="bg-white border border-slate-200 px-2 py-0.5 rounded-md text-[11px]">
                    ${it.title} × ${formatNumber(it.quantity)} (${formatPrice(it.price)})
                  </span>
                `).join('')}
              </div>
            </div>
          `;
        }).join('');
      }
    }

  } catch (err) {
    console.error('Error fetching admin stats from Supabase:', err);
    if (ordersContainer) {
      ordersContainer.innerHTML = '<p class="text-xs text-red-500 py-4 text-center">خطا در دریافت سفارشات از سرور.</p>';
    }
  }
}

// تابع کمکی برای بارگذاری اولیه داده‌های نمونه در صورت خالی بودن دیتابیس سوپابیس
async function seedInitialProductsToSupabase() {
  if (!confirm('آیا مایلید ۹ محصول باکیفیت و نمونه را در جدول products دیتابیس Supabase ذخیره کنید؟')) return;

  try {
    showToast('در حال ارسال محصولات نمونه به Supabase...', 'info');
    
    const client = getSupabase();
    if (!client) throw new Error('Supabase client not initialized');

    const seedData = FALLBACK_PRODUCTS.map(p => ({
      title: p.title,
      category: p.category,
      price: p.price,
      image_url: p.image_url,
      description: p.description,
      status: p.status,
      rating: p.rating,
      review_count: p.review_count,
      is_featured: p.is_featured,
      stock: p.stock
    }));

    const { error } = await client.from('products').insert(seedData);
    if (error) throw error;

    showToast('محصولات نمونه با موفقیت در جدول Supabase ذخیره شدند 🎉', 'success');
    await loadProducts();
    await loadAdminProducts();
  } catch (err) {
    console.error('Error seeding data:', err);
    showToast('خطا در ذخیره نمونه‌ها در Supabase: ' + err.message, 'error');
  }
}

// پشتیبانی از مسیریابی هش (#admin) و کلیدهای میانبر
function setupHashRouting() {
  if (window.location.hash === '#admin') {
    openAdmin();
  }

  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#admin') {
      openAdmin();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearch();
      closeProductDetail();
      closeCart();
      closeWishlist();
      closeCheckout();
      closeAdmin();
      closeOrderSuccess();
    }
  });
}

// ==========================================
// اتصال مستقیم کلیه توابع تعاملی به شیء window
// ==========================================
window.toggleMobileNav = toggleMobileNav;
window.openCart = openCart;
window.closeCart = closeCart;
window.openWishlist = openWishlist;
window.closeWishlist = closeWishlist;
window.openSearch = openSearch;
window.closeSearch = closeSearch;
window.handleSearch = handleSearch;
window.filterCategory = filterCategory;
window.handleSortChange = handleSortChange;
window.openProductDetail = openProductDetail;
window.closeProductDetail = closeProductDetail;
window.selectDetailColor = selectDetailColor;
window.changeDetailQty = changeDetailQty;
window.addCustomToCart = addCustomToCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.toggleWishlist = toggleWishlist;
window.openCheckout = openCheckout;
window.closeCheckout = closeCheckout;
window.handlePlaceOrder = handlePlaceOrder;
window.closeOrderSuccess = closeOrderSuccess;
window.openAdmin = openAdmin;
window.closeAdmin = closeAdmin;
window.switchAdminTab = switchAdminTab;
window.handleAdminAddProduct = handleAdminAddProduct;
window.adminDeleteProduct = adminDeleteProduct;
window.loadAdminProducts = loadAdminProducts;
window.loadAdminOrdersAndStats = loadAdminOrdersAndStats;
window.seedInitialProductsToSupabase = seedInitialProductsToSupabase;
window.showComingSoonToast = showComingSoonToast;
window.handleNewsletter = handleNewsletter;
window.handleReviewSubmit = handleReviewSubmit;
window.getSupabase = getSupabase;


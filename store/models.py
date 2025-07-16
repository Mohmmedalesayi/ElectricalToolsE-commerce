from django.db import models
from django.utils import timezone # هذا السطر مهم لاستخدام timezone.now

# نموذج الصنف (Category)
# هذا النموذج يمثل الأصناف المختلفة للمنتجات في متجرك، مثل "مثاقب" أو "مناشير".
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="اسم الصنف")
    description = models.TextField(blank=True, null=True, verbose_name="الوصف")
    created_at = models.DateTimeField(auto_now_add=True) # تاريخ ووقت إنشاء الصنف
    updated_at = models.DateTimeField(auto_now=True)   # تاريخ ووقت آخر تحديث للصنف

    class Meta:
        verbose_name = "صنف"
        verbose_name_plural = "الأصناف"
        ordering = ['name'] # ترتيب الأصناف أبجديًا بالاسم في لوحة الإدارة

    def __str__(self):
        return self.name # يعرض اسم الصنف عند الإشارة إليه

# نموذج المنتج (Product)
# هذا النموذج يمثل المنتجات الفردية التي تبيعها.
class Product(models.Model):
    name = models.CharField(max_length=200, verbose_name="اسم المنتج")
    description = models.TextField(verbose_name="الوصف")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="السعر")
    image_url = models.URLField(max_length=1024, blank=True, null=True, verbose_name="رابط الصورة")
    # حقل المفتاح الخارجي لربط المنتج بالصنف الذي ينتمي إليه.
    # on_delete=models.SET_NULL يعني إذا تم حذف الصنف، فسيتم تعيين حقل الصنف في المنتج إلى NULL بدلاً من حذف المنتج.
    # null=True, blank=True يسمح بأن يكون المنتج بلا صنف (مفيد للمنتجات القديمة أو التي لم يتم تصنيفها بعد).
    # related_name='products' يسمح لك بالوصول إلى المنتجات من خلال كائن الصنف (مثال: category.products.all()).
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='products', verbose_name="الصنف")
    stock = models.IntegerField(default=0, verbose_name="المخزون المتاح") # حقل جديد لتتبع كمية المخزون المتاحة للمنتج
    is_available = models.BooleanField(default=True, verbose_name="متاح للعرض") # هل المنتج متاح للعرض في المتجر؟
    created_at = models.DateTimeField(auto_now_add=True) # تاريخ ووقت إنشاء المنتج
    updated_at = models.DateTimeField(auto_now=True)   # تاريخ ووقت آخر تحديث للمنتج

    class Meta:
        verbose_name = "منتج"
        verbose_name_plural = "المنتجات"
        ordering = ['name'] # ترتيب المنتجات أبجديًا بالاسم في لوحة الإدارة

    def __str__(self):
        return self.name # يعرض اسم المنتج عند الإشارة إليه


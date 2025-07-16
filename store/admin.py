from django.contrib import admin
from .models import Product, Category # استورد Product و Category من ملف models.py

# ==============================================================================
# تسجيل نموذج الصنف (Category) في لوحة الإدارة
# ==============================================================================
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    # list_display: الحقول التي ستظهر في قائمة الأصناف في لوحة الإدارة
    list_display = ('name', 'description', 'created_at')
    # search_fields: الحقول التي يمكن البحث عنها في قائمة الأصناف
    search_fields = ('name',)
    # list_filter: الحقول التي يمكن التصفية بناءً عليها في قائمة الأصناف
    # لا يوجد فلاتر افتراضية هنا، ولكن يمكن إضافتها إذا لزم الأمر

# ==============================================================================
# تسجيل نموذج المنتج (Product) في لوحة الإدارة
# ==============================================================================
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # list_display: الحقول التي ستظهر في قائمة المنتجات في لوحة الإدارة
    # تم إضافة 'stock' هنا لعرض كمية المخزون
    list_display = ('name', 'category', 'price', 'stock', 'is_available', 'created_at')
    # list_filter: الحقول التي يمكن التصفية بناءً عليها في قائمة المنتجات
    # تم إضافة 'category' هنا لتصفية المنتجات حسب الصنف
    list_filter = ('is_available', 'category')
    # search_fields: الحقول التي يمكن البحث عنها في قائمة المنتجات
    search_fields = ('name', 'description')
    # list_editable: الحقول التي يمكن تعديلها مباشرة من قائمة المنتجات دون الحاجة لفتح صفحة التعديل لكل منتج
    # تم إضافة 'price', 'stock', 'is_available' هنا لتسهيل إدارة المخزون والأسعار
    list_editable = ('price', 'stock', 'is_available')


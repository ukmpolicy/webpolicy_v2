<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogArticleCategory extends Model
{
    use HasFactory;

    protected $fillable = ['article_id', 'category_id'];

    // Relasi ke artikel
    public function article()
    {
        return $this->belongsTo(BlogArticle::class, 'article_id');
    }

    // Relasi ke kategori
    public function category()
    {
        return $this->belongsTo(BlogCategory::class, 'category_id');
    }
}

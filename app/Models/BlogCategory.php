<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class BlogCategory extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    // Relasi many-to-many ke artikel
     public function articles(): BelongsToMany // Tambahkan type hint
    {
        return $this->belongsToMany(BlogArticle::class, 'blog_article_categories', 'category_id', 'article_id');
    }
}

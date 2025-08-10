<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // Tambahkan ini
use Illuminate\Database\Eloquent\Relations\BelongsToMany; // Tambahkan ini
use Illuminate\Support\Str;
class BlogArticle extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'picture', 'slug', 'summary', 'content', 'author_id', 'status', 'view_count'];

    /**
     * Relasi ke penulis (user).
     */
    public function author(): BelongsTo
    {
        // Tambahkan type hint
        // Tambahkan type hint
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Relasi many-to-many ke kategori.
     */
    public function categories(): BelongsToMany
    {
        // Tambahkan type hint
        // Tambahkan type hint
        return $this->belongsToMany(BlogCategory::class, 'blog_article_categories', 'article_id', 'category_id');
    }

    // Mutator untuk otomatis membuat slug dari title
    public function setTitleAttribute($value)
    {
        $this->attributes['title'] = $value;
        $this->attributes['slug'] = Str::slug($value);
    }
}

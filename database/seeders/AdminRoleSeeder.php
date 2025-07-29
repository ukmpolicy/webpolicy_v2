<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      // 1. Buat role admin jika belum ada
        $adminRole = Role::firstOrCreate(['name' => 'admin']);

        // 2. Ambil semua permission
        $permissions = Permission::all();

        // 3. Assign semua permission ke role admin
        $adminRole->permissions()->sync($permissions->pluck('id')->toArray());

        // 4. (Opsional) Assign role admin ke user pertama
        $user = User::first();
        if ($user) {
            $user->role_id = $adminRole->id;
            $user->save();
        }
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RolePermissionController extends Controller
{
    public function updatePermissions(Request $request, $roleId)
    {
        $role = \App\Models\Role::findOrFail($roleId);
        $permissionIds = $request->input('permissions', []);
        $role->permissions()->sync($permissionIds);
        return back()->with('success', 'Permissions updated!');
    }
}

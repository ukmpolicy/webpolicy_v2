<?php

namespace App\Http\Controllers;

use App\Services\RoleService;
use Illuminate\Http\Request;

class RolePermissionController extends Controller
{
    protected $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }
    public function updatePermissions(Request $request, $roleId)
    {
        $permissionIds = $request->input('permissions', []);
        $this->roleService->syncPermissions($roleId, $permissionIds);
        return back()->with('success', 'Permissions updated!');
    }
}

<?php

namespace App\Http\Controllers;

use App\Services\RoleService;
use App\Services\PermissionService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    protected $roleService;
    protected $permissionService;
    protected $userService; // Tambahkan property

    public function __construct(RoleService $roleService, PermissionService $permissionService, UserService $userService)
    {
        $this->roleService = $roleService;
        $this->permissionService = $permissionService;
        $this->userService = $userService; // Tambahkan ini
    }

    public function index()
    {
        $roles = $this->roleService->getAllRoles();
        $permissions = $this->permissionService->getAllPermissions();
        $users = $this->userService->getAllUsers(); // Ambil dari service, bukan model langsung
        return Inertia::render('roles/index', [
            'roles' => $roles,
            'permissions' => $permissions,
            'users' => $users, // Kirim ke frontend
            'canManageUsers' => $this->userService->hasPermission(auth()->user(), 'manage-users'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|unique:roles,name',
        ]);
        $this->roleService->createRole($data);
        return redirect()->back()->with('success', 'Role created!');
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'required|unique:roles,name,' . $id,
        ]);
        $this->roleService->updateRole($id, $data);
        return redirect()->back()->with('success', 'Role updated!');
    }

    public function destroy($id)
    {
        $this->roleService->deleteRole($id);
        return redirect()->back()->with('success', 'Role deleted!');
    }

    public function inviteUser(Request $request, $roleId)
    {
        $data = $request->validate(['email' => 'required|email']);
        $this->roleService->assignOrInviteUserByEmail($roleId, $data['email']);
        return back()->with('success', 'User assigned/invited!');
    }

    public function removeUser(Request $request, $roleId)
    {
        $data = $request->validate(['user_id' => 'required|exists:users,id']);
        $this->roleService->removeUserFromRole($roleId, $data['user_id']);
        return back()->with('success', 'User removed from role!');
    }
}

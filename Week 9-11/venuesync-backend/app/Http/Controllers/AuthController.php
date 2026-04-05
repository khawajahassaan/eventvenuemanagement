<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rules\Password;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'phone'    => 'nullable|string|max:20',
            'password' => ['required', Password::min(8)],
            'role'     => 'required|in:planner,owner',
        ]);

        $user         = User::create($data);
        $accessToken  = JWTAuth::fromUser($user);
        $refreshToken = JWTAuth::fromUser($user, ['type' => 'refresh']);

        return response()->json([
            'user'   => $this->formatUser($user),
            'tokens' => ['accessToken' => $accessToken, 'refreshToken' => $refreshToken],
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid email or password.'], 401);
        }

        $user         = JWTAuth::user();
        $refreshToken = JWTAuth::fromUser($user, ['type' => 'refresh']);

        return response()->json([
            'user'   => $this->formatUser($user),
            'tokens' => ['accessToken' => $token, 'refreshToken' => $refreshToken],
        ]);
    }

    public function logout(): JsonResponse
    {
        JWTAuth::invalidate(JWTAuth::getToken());
        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $this->formatUser($request->user())]);
    }

    private function formatUser(User $user): array
    {
        return [
            'id'        => $user->id,
            'name'      => $user->name,
            'email'     => $user->email,
            'phone'     => $user->phone,
            'role'      => $user->role,
            'createdAt' => $user->created_at,
        ];
    }
}

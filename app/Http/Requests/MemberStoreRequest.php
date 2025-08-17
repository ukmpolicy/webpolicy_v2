<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MemberStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'period_id' => 'required|exists:periods,id',
            'picture' => 'required|image|max:2048',
            'name' => 'required|string|max:50',
            'nim' => 'required|string|max:50|unique:members,nim',
            'address' => 'required|string|max:255',
            'email' => 'required|email|max:50|unique:members,email',
            'no_wa' => 'required|max:20',
            'department' => 'required|string',
            'study_program' => 'required|string|max:255',
            'joined_college_on' => 'required|integer',
            'graduated_college_on' => 'nullable|integer',
            'born_at' => 'required|string|max:50',
            'birth_date_at' => 'required|date',
        ];
    }
}

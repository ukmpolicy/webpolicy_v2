<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Data Member</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            margin: 0;
            padding: 0;
        }
        .container {
            padding: 20px;
        }
        h1 {
            text-align: center;
            font-size: 18px;
            margin-bottom: 10px;
        }
        h2 {
            text-align: center;
            font-size: 14px;
            font-weight: normal;
            margin-top: 0;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #000;
            padding: 5px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Data Member</h1>
        <h2>Periode: {{ $periodName }}</h2>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Nama</th>
                    <th>NIM</th>
                    <th>Email</th>
                    <th>No. WA</th>
                    <th>Alamat</th>
                    <th>Jurusan</th>
                    <th>Program Studi</th>
                    <th>Tahun Masuk</th>
                    <th>Tahun Lulus</th>
                    <th>Tempat & Tanggal Lahir</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($members as $index => $member)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $member->name }}</td>
                        <td>{{ $member->nim }}</td>
                        <td>{{ $member->email }}</td>
                        <td>{{ $member->no_wa }}</td>
                        <td>{{ $member->address }}</td>
                        <td>{{ $member->department }}</td>
                        <td>{{ $member->study_program }}</td>
                        <td>{{ $member->joined_college_on }}</td>
                        <td>{{ $member->graduated_college_on ?? '-' }}</td>
                        <td>
                            {{ $member->born_at }},
                            @if($member->birth_date_at)
                                {{ \Carbon\Carbon::parse($member->birth_date_at)->translatedFormat('d F Y') }}
                            @else
                                -
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</body>
</html>

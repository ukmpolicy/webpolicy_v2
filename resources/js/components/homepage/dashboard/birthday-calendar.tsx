import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Cake, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';

const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

interface BirthdayCalendarProps {
    birthdays: {
        [key: string]: string[]; // Format: 'MM-DD': ['Nama1', 'Nama2']
    };
}

export default function BirthdayCalendar({ birthdays }: BirthdayCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 for Sunday

    const days = useMemo(() => {
        const calendarDays = [];
        // Isi hari-hari kosong di awal bulan
        for (let i = 0; i < firstDayOfWeek; i++) {
            calendarDays.push(null);
        }
        // Isi hari-hari di bulan ini
        for (let i = 1; i <= daysInMonth; i++) {
            calendarDays.push(i);
        }
        return calendarDays;
    }, [year, month, daysInMonth, firstDayOfWeek]);

    const getBirthdaysForDay = (day: number) => {
        const dateKey = `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return birthdays[dateKey] || [];
    };

    const handlePrevMonth = () => {
        setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    return (
        <Card className="p-4">
            <CardHeader className="flex flex-row items-center justify-between p-0">
                <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-sm font-semibold">
                    {monthNames[month]} {year}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="mt-4 p-0">
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                        <div key={day} className="text-muted-foreground font-semibold">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="mt-2 grid grid-cols-7 gap-1">
                    {days.map((day, index) => {
                        const birthdaysToday = day !== null ? getBirthdaysForDay(day) : [];
                        const isToday =
                            day !== null && new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

                        return (
                            <div key={index} className="flex flex-col items-center">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                'relative flex h-8 w-full items-center justify-center rounded-full p-0 text-sm',
                                                day === null && 'pointer-events-none invisible',
                                                isToday && 'bg-primary text-primary-foreground hover:bg-primary/90',
                                                birthdaysToday.length > 0 && 'bg-rose-500 text-white hover:bg-rose-600',
                                                isToday && birthdaysToday.length > 0 && 'border-primary border-2 bg-rose-500 text-white',
                                            )}
                                            disabled={day === null || birthdaysToday.length === 0}
                                        >
                                            {day}
                                            {birthdaysToday.length > 0 && (
                                                <Cake className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300" fill="currentColor" />
                                            )}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                Ulang Tahun pada {day} {monthNames[month]} {year}
                                            </DialogTitle>
                                        </DialogHeader>
                                        <div className="mt-4">
                                            {birthdaysToday.length > 0 ? (
                                                <ul className="space-y-2">
                                                    {birthdaysToday.map((name, i) => (
                                                        <li key={i} className="flex items-center gap-2 text-sm">
                                                            <Cake className="h-4 w-4 text-rose-500" />
                                                            <span>{name}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>Tidak ada ulang tahun pada tanggal ini.</p>
                                            )}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

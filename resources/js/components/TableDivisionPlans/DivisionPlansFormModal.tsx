import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function DivisionPlansFormModal({ open, onClose, initialData, divisions }) {
    const isEdit = !!initialData?.id;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        description: '',
        scheduled_at: '',
        division_id: '',
        ...initialData,
    });

    useEffect(() => {
        if (initialData) {
            setData({
                name: initialData.name || '',
                description: initialData.description || '',
                scheduled_at: initialData.scheduled_at ? new Date(initialData.scheduled_at).toISOString().slice(0, 16) : '',
                division_id: initialData.division_id ? initialData.division_id.toString() : '',
            });
        } else {
            reset();
        }
    }, [initialData, open]);

    function handleSubmit(e) {
        e.preventDefault();

        const action = isEdit
            ? put(`/division-plans/${initialData.id}`, {
                  data,
                  onSuccess: () => {
                      toast.success('Plan updated successfully!');
                      onClose();
                  },
                  onError: (errors) => {
                      toast.error('Failed to update plan.');
                  },
              })
            : post('/division-plans', {
                  data,
                  onSuccess: () => {
                      toast.success('Plan created successfully!');
                      onClose();
                      reset();
                  },
                  onError: (errors) => {
                      toast.error('Failed to create plan.');
                  },
              });
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Plan' : 'Add Plan'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Plan Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="min-h-[100px]"
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="division_id">Division</Label>
                        <Select value={data.division_id} onValueChange={(value) => setData('division_id', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select division" />
                            </SelectTrigger>
                            <SelectContent>
                                {divisions &&
                                    divisions.map((division) => (
                                        <SelectItem key={division.id} value={division.id.toString()}>
                                            {division.name}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                        {errors.division_id && <p className="text-sm text-red-500">{errors.division_id}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="scheduled_at">Scheduled At</Label>
                        <div className="relative">
                            <Input
                                id="scheduled_at"
                                type="date"
                                value={data.scheduled_at}
                                onChange={(e) => setData('scheduled_at', e.target.value)}
                            />
                        </div>
                        {errors.scheduled_at && <p className="text-sm text-red-500">{errors.scheduled_at}</p>}
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" onClick={onClose}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {isEdit ? 'Update Plan' : 'Create Plan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

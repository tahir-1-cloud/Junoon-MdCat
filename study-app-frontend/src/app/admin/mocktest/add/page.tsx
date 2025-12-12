'use client';

import {useState} from 'react';
import {addMockPaper} from '@/services/mocktestService';
import {CreateMockTestDto} from "@/types/mocktest";
import {Button} from '@/components/ui/button';
import {Calendar} from '@/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {format} from 'date-fns';
import {cn} from '@/lib/utils';
import {toast} from "sonner"
import {CalendarIcon} from 'lucide-react';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import DatePicker from '@/components/form/date-picker';

export default function AddMockPaperForm() {

    const [title, setTitle] = useState('');
    const [testDate, setTestDate] = useState<Date>();
    const [open, setOpen] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !testDate) {
            toast.error('Please enter a title and pick a date');
            return;
        }
        const mock: CreateMockTestDto = {
            title,
            testConductedOn: testDate,
        };

        try {
            await addMockPaper(mock);
            toast.success("Mock-Paper added successfully!");
            
            // Reset form
            setTitle('');
            setTestDate(undefined);
        } catch (error: unknown) {
            const message =
                (error as Error)?.message ||
                'Something went wrong.';

            toast.error(message);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <ComponentCard title="Add MockPaper">
                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter title here..."/>
                        </div>

                        <div>
                            <DatePicker
                                id="date-picker"
                                label="Publication Date"
                                placeholder="Select a date"
                                onChange={(dates, currentDateString) => {
                                    setTestDate(dates[0]);
                                }}
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
                            >
                                Submit
                            </button>
                        </div>

                    </ComponentCard>
                </form>
            </div>
        </>
    );
}
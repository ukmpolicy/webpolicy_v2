import React, { useState } from 'react';

import FormActions from './FormActions';
import StepIndicator from './StepIndicator';
import DocumentUploadSection from './sections/DocumentUploadSection';
import MotivationSection from './sections/MotivationSection';
import PersonalDataSection from './sections/PersonalDataSection';
import QuestionnaireSection from './sections/QuestionnaireSection';
import ReviewSection from './sections/ReviewSection';
import SocialRequirementSection from './sections/SocialRequirementSection';

type OpenRecruitmentFormState = {
    nama: string;
    nim: string;
    jurusan: string;
    prodi: string;
    alamat: string;
    tgl_lahir: string;
    tempat_lahir: string;
    jenis_kelamin: string;
    agama: string;
    no_wa: string;
    email: string;

    soft_skill: string;
    pengalaman_organisasi: string;
    motivasi: string;
    motto: string;

    deskripsi_diri: string;
    alasan_bergabung: string;
    makna_logo: string;
    visi_misi: string;
    sejarah_ukm: string;
    pengetahuan_linux: string;

    follow_ig: File | null;
    follow_tiktok: File | null;
    follow_yt: File | null;

    pas_photo: File | null;
    sertifikat_ppkmb: File | null;
    bukti_pembayaran: File | null;
    
};

const initialFormState: OpenRecruitmentFormState = {
    nama: '',
    nim: '',
    jurusan: '',
    prodi: '',
    alamat: '',
    tgl_lahir: '',
    tempat_lahir: '',
    jenis_kelamin: '',
    agama: '',
    no_wa: '',
    email: '',

    soft_skill: '',
    pengalaman_organisasi: '',
    motivasi: '',
    motto: '',

    deskripsi_diri: '',
    alasan_bergabung: '',
    makna_logo: '',
    visi_misi: '',
    sejarah_ukm: '',
    pengetahuan_linux: '',

    follow_ig: null,
    follow_tiktok: null,
    follow_yt: null,

    pas_photo: null,
    sertifikat_ppkmb: null,
    bukti_pembayaran: null,
   
};

const TOTAL_STEPS = 5;

const OpenRecruitmentMultiStepForm: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<OpenRecruitmentFormState>(initialFormState);

    const handleTextChange = (field: keyof OpenRecruitmentFormState, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFileChange = (field: keyof OpenRecruitmentFormState, value: File | null) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const nextStep = () => {
        setCurrentStep((prev) => (prev < TOTAL_STEPS ? prev + 1 : prev));
    };

    const prevStep = () => {
        setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
    };

    const handleSubmit = () => {
        console.log('Template Open Recruitment Data:', formData);
        alert('Template form berhasil dicek. Submit backend belum dihubungkan.');
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <PersonalDataSection
                        values={{
                            nama: formData.nama,
                            nim: formData.nim,
                            jurusan: formData.jurusan,
                            prodi: formData.prodi,
                            alamat: formData.alamat,
                            tgl_lahir: formData.tgl_lahir,
                            tempat_lahir: formData.tempat_lahir,
                            jenis_kelamin: formData.jenis_kelamin,
                            agama: formData.agama,
                            no_wa: formData.no_wa,
                            email: formData.email,
                        }}
                        onChange={handleTextChange}
                    />
                );

            case 2:
                return (
                    <MotivationSection
                        values={{
                            soft_skill: formData.soft_skill,
                            pengalaman_organisasi: formData.pengalaman_organisasi,
                            motivasi: formData.motivasi,
                            motto: formData.motto,
                        }}
                        onChange={handleTextChange}
                    />
                );

            case 3:
                return (
                    <QuestionnaireSection
                        values={{
                            deskripsi_diri: formData.deskripsi_diri,
                            alasan_bergabung: formData.alasan_bergabung,
                            makna_logo: formData.makna_logo,
                            visi_misi: formData.visi_misi,
                            sejarah_ukm: formData.sejarah_ukm,
                            pengetahuan_linux: formData.pengetahuan_linux,
                        }}
                        onChange={handleTextChange}
                    />
                );

            case 4:
                return (
                    <div className="space-y-8">
                        <SocialRequirementSection
                            values={{
                                follow_ig: formData.follow_ig,
                                follow_tiktok: formData.follow_tiktok,
                                follow_yt: formData.follow_yt,
                            }}
                            onChange={handleFileChange}
                        />

                        <DocumentUploadSection
                            values={{
                                pas_photo: formData.pas_photo,
                                sertifikat_ppkmb: formData.sertifikat_ppkmb,
                                bukti_pembayaran: formData.bukti_pembayaran,
                        
                            }}
                            onChange={handleFileChange}
                        />
                    </div>
                );

            case 5:
                return <ReviewSection values={formData} />;

            default:
                return null;
        }
    };

    return (
        <section className="space-y-6">
            <StepIndicator currentStep={currentStep} />

            <div className="rounded-[28px] border border-white/10 bg-black/30 p-4 shadow-xl sm:p-6 lg:p-8">
                {renderCurrentStep()}
            </div>

            <FormActions
                currentStep={currentStep}
                totalSteps={TOTAL_STEPS}
                onBack={prevStep}
                onNext={nextStep}
                onSubmit={handleSubmit}
            />
        </section>
    );
};

export default OpenRecruitmentMultiStepForm;
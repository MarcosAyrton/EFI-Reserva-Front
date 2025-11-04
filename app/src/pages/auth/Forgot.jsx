import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../components/ui/Button';
import InputPro from '../../components/ui/InputPro';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Email inválido'),
});

export default function Forgot() {
  const { forgotPassword, loading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email }) => {
    try {
      await forgotPassword(email);
      toast.success('Te enviamos un email con instrucciones si el correo existe.');
    } catch (e) {
      const msg = e?.response?.data?.message || 'No pudimos enviar el email';
      toast.error(msg);
    }
  };

  return (
    <div className="bg-slate-900/60 rounded-xl p-6 shadow-xl border border-slate-800">
      <h2 className="text-2xl font-semibold mb-1">Recuperar contraseña</h2>
      <p className="text-sm text-slate-400 mb-6">Ingresá tu email para recibir un link</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputPro label="Email" type="email" placeholder="tu@email.com" {...register('email')} error={errors.email?.message}
          leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><path d='M4 6h16v12H4z'/><path d='M22 6l-10 7L2 6'/></svg>}
        />
        <Button type="submit" loading={loading} className="w-full">Enviar</Button>
      </form>
      <div className="mt-4 text-sm text-slate-400">
        <Link to="/auth/login" className="text-blue-400 hover:text-blue-300">Volver al login</Link>
      </div>
    </div>
  );
}

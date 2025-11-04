import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../components/ui/Button';
import InputPro from '../../components/ui/InputPro';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const schema = z.object({
  id: z.string().min(1, 'ID requerido'),
  token: z.string().min(1, 'Token requerido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirm_password: z.string().min(6, 'Confirmá tu contraseña'),
}).refine((d) => d.password === d.confirm_password, { message: 'Las contraseñas no coinciden', path: ['confirm_password']});

export default function Reset() {
  const navigate = useNavigate();
  const { resetPassword, loading } = useAuth();
  const [params] = useSearchParams();
  const idParam = params.get('id') || '';
  const tokenParam = params.get('token') || '';

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { id: idParam, token: tokenParam },
  });

  const onSubmit = async (values) => {
    try {
      await resetPassword({ ...values, id: Number(values.id) });
      toast.success('Contraseña actualizada!');
      navigate('/auth/login');
    } catch (e) {
      const msg = e?.response?.data?.message || 'No se pudo actualizar';
      toast.error(msg);
    }
  };

  return (
    <div className="bg-slate-900/60 rounded-xl p-6 shadow-xl border border-slate-800">
      <h2 className="text-2xl font-semibold mb-1">Restablecer contraseña</h2>
      <p className="text-sm text-slate-400 mb-6">Ingresá tu nueva contraseña</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <InputPro label="ID de usuario" placeholder="123" {...register('id')} error={errors.id?.message}
          leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><path d='M12 8v8M8 12h8'/></svg>}
        />
        <InputPro label="Token" placeholder="token..." {...register('token')} error={errors.token?.message}
          leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><rect x='3' y='4' width='18' height='16' rx='2'/><path d='M7 8h10M7 12h6'/></svg>}
        />
        <InputPro label="Nueva contraseña" type="password" {...register('password')} error={errors.password?.message}
          leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><rect x='3' y='11' width='18' height='10' rx='2'/><path d='M7 11V7a5 5 0 0 1 10 0v4'/></svg>}
        />
        <InputPro label="Confirmar contraseña" type="password" {...register('confirm_password')} error={errors.confirm_password?.message}
          leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><rect x='3' y='11' width='18' height='10' rx='2'/><path d='M7 11V7a5 5 0 0 1 10 0v4'/></svg>}
        />
        <Button type="submit" loading={loading} className="w-full mt-2">Actualizar</Button>
      </form>
      <div className="mt-4 text-sm text-slate-400">
        <Link to="/auth/login" className="text-blue-400 hover:text-blue-300">Volver al login</Link>
      </div>
    </div>
  );
}

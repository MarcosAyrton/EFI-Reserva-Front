import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../components/ui/Button';
import InputPro from '../../components/ui/InputPro';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  age: z.string().min(1, 'Edad requerida'),
  gender: z.enum(['female','male','other'], { required_error: 'Género requerido' }),
  birthday: z.string().optional(),
  dni: z.string().min(5, 'DNI requerido'),
  mail: z.string().email('Email inválido'),
  phone: z.string().min(6, 'Teléfono inválido'),
  username: z.string().min(3, 'Mínimo 3 caracteres'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirm_password: z.string().min(6, 'Confirmá tu contraseña'),
}).refine((d) => d.password === d.confirm_password, { message: 'Las contraseñas no coinciden', path: ['confirm_password']});

export default function Register() {
  const navigate = useNavigate();
  const { register: signUp, loading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      await signUp(values);
      toast.success('Cuenta creada! Ahora podés iniciar sesión');
      navigate('/auth/login');
    } catch (e) {
      const msg = e?.response?.data?.message || 'Error al registrar';
      toast.error(msg);
    }
  };

  return (
    <div className="bg-slate-900/60 rounded-xl p-6 shadow-xl border border-slate-800">
      <h2 className="text-2xl font-semibold mb-1">Crear cuenta</h2>
      <p className="text-sm text-slate-400 mb-6">Completá tus datos</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InputPro label="Nombre" {...register('name')} error={errors.name?.message}
            leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>}
          />
          <InputPro label="Edad" type="number" {...register('age')} error={errors.age?.message}
            leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><path d='M12 8v8M8 12h8'/></svg>}
          />
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Género</label>
            <select className="w-full bg-slate-800 text-slate-100 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" {...register('gender')}>
              <option value="">Seleccioná</option>
              <option value="female">Femenino</option>
              <option value="male">Masculino</option>
              <option value="other">Otro</option>
            </select>
            {errors.gender?.message && <p className="mt-1 text-sm text-red-400">{errors.gender.message}</p>}
          </div>
          <InputPro label="DNI" {...register('dni')} error={errors.dni?.message}
            leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><rect x='3' y='4' width='18' height='16' rx='2'/><path d='M7 8h10M7 12h6'/></svg>}
          />
          <InputPro label="Email" type="email" {...register('mail')} error={errors.mail?.message}
            leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><path d='M4 6h16v12H4z'/><path d='M22 6l-10 7L2 6'/></svg>}
          />
          <InputPro label="Teléfono" {...register('phone')} error={errors.phone?.message}
            leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.09 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72 12.66 12.66 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.16a2 2 0 0 1 2.11-.45 12.66 12.66 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'/></svg>}
          />
          <InputPro label="Usuario" {...register('username')} error={errors.username?.message}
            leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>}
          />
          <InputPro label="Fecha de nacimiento" type="date" {...register('birthday')} error={errors.birthday?.message}
            leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><rect x='3' y='4' width='18' height='18' rx='2'/><path d='M16 2v4M8 2v4M3 10h18'/></svg>}
          />
          <InputPro label="Contraseña" type="password" {...register('password')} error={errors.password?.message}
            leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><rect x='3' y='11' width='18' height='10' rx='2'/><path d='M7 11V7a5 5 0 0 1 10 0v4'/></svg>}
          />
          <InputPro label="Confirmar contraseña" type="password" {...register('confirm_password')} error={errors.confirm_password?.message}
            leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><rect x='3' y='11' width='18' height='10' rx='2'/><path d='M7 11V7a5 5 0 0 1 10 0v4'/></svg>}
          />
        </div>
        <Button type="submit" loading={loading} className="w-full mt-2">Crear cuenta</Button>
      </form>
      <div className="mt-4 text-sm text-slate-400">
        ¿Ya tenés cuenta? <Link to="/auth/login" className="text-blue-400 hover:text-blue-300">Iniciá sesión</Link>
      </div>
    </div>
  );
}

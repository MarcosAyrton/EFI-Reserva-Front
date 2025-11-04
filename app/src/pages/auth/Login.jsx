import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../components/ui/Button';
import InputPro from '../../components/ui/InputPro';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const schema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      await login(values.username, values.password);
      toast.success('Bienvenido!');
      navigate('/dashboard');
    } catch (e) {
      const msg = e?.response?.data?.message || 'Credenciales inválidas';
      toast.error(msg);
    }
  };

  return (
    <div className="bg-slate-900/60 rounded-xl p-6 shadow-xl border border-slate-800">
      <h2 className="text-2xl font-semibold mb-1">Iniciar sesión</h2>
      <p className="text-sm text-slate-400 mb-6">Accedé a tu cuenta</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputPro label="Usuario" placeholder="tu_usuario" {...register('username')} error={errors.username?.message}
          leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>}
        />
        <InputPro label="Contraseña" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message}
          leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><rect x='3' y='11' width='18' height='10' rx='2'/><path d='M7 11V7a5 5 0 0 1 10 0v4'/></svg>}
        />
        <div className="flex items-center justify-between text-sm">
          <Link to="/auth/forgot" className="text-blue-400 hover:text-blue-300">Olvidé mi contraseña</Link>
        </div>
        <Button type="submit" loading={loading} className="w-full">Entrar</Button>
      </form>
      <div className="mt-4 text-sm text-slate-400">
        ¿No tenés cuenta? <Link to="/auth/register" className="text-blue-400 hover:text-blue-300">Registrate</Link>
      </div>
    </div>
  );
}

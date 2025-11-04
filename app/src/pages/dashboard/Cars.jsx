import { useQuery, useMutation } from '@tanstack/react-query';
import * as carsService from '../../services/cars';
import * as rentalsService from '../../services/rentals';
import * as clientsService from '../../services/clients';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputPro from '../../components/ui/InputPro';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import { motion } from 'framer-motion';
import { uploadImage } from '../../services/uploader';
import DateRangePicker from '../../components/ui/DateRangePicker';
import { useNotifications } from '../../contexts/NotificationsContext';

const carSchema = z.object({
  brand: z.string().min(1, 'Marca requerida'),
  model: z.string().min(1, 'Modelo requerido'),
  color: z.string().min(1, 'Color requerido'),
  age: z.string().min(1, 'Año requerido'),
  price_day: z.preprocess((v) => Number(v), z.number().positive('Precio inválido')),
  stock: z.preprocess((v) => Number(v), z.number().int().nonnegative('Stock inválido')),
  available: z.boolean().default(true),
  image: z.any().optional(), // file input (optional)
});

export default function Cars() {
  const { role, user } = useAuth();
  const isAdmin = role === 'admin';
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [openRent, setOpenRent] = useState(false);
  const [rentCar, setRentCar] = useState(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['cars'],
    queryFn: () => carsService.listCars(),
  });

  const createMutation = useMutation({
    mutationFn: async (values) => {
      let imageUrl;
      if (values.image?.[0]) {
        const up = await uploadImage(values.image[0], 'autos');
        imageUrl = up.url;
      }
      const payload = {
        brand: values.brand,
        model: values.model,
        color: values.color,
        age: values.age,
        price_day: values.price_day,
        stock: values.stock,
        image: imageUrl,
        available: values.available,
        availble: values.available,
        is_active: true,
      };
      return carsService.createCar(payload);
    },
    onSuccess: () => {
      toast.success('Auto creado');
      setOpenCreate(false);
      refetch();
    },
    onError: (e) => {
      const msg = e?.response?.data?.message || 'No se pudo crear el auto';
      toast.error(msg);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, values }) => {
      let imageUrl = values.currentImageUrl || undefined;
      if (values.image?.[0]) {
        const up = await uploadImage(values.image[0], 'autos');
        imageUrl = up.url;
      }
      const payload = {
        brand: values.brand,
        model: values.model,
        color: values.color,
        age: values.age,
        price_day: values.price_day,
        stock: values.stock,
        available: values.available,
        availble: values.available,
        image: imageUrl,
      };
      return carsService.updateCar(id, payload);
    },
    onSuccess: () => {
      toast.success('Auto actualizado');
      setOpenEdit(false);
      setEditingCar(null);
      refetch();
    },
    onError: (e) => {
      const msg = e?.response?.data?.message || 'No se pudo actualizar el auto';
      toast.error(msg);
    }
  });

  // Para customers, mostrar solo disponibles con stock > 0
  const cars = (data || []).filter((car) => {
    if (isAdmin) return true;
    const available = car.available ?? car.availble; // por si el backend aún tiene el typo
    const stock = Number(car.stock ?? 0);
    return Boolean(available) && stock > 0;
  });

  const openEditModal = (car) => {
    setEditingCar(car);
    setOpenEdit(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Autos</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => refetch()}>Refrescar</Button>
          {isAdmin && <Button onClick={() => setOpenCreate(true)}>Agregar auto</Button>}
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-60 rounded-lg bg-slate-800/60 animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="p-4 rounded-md bg-red-900/40 border border-red-800 text-red-200">No pudimos cargar los autos.</div>
      )}

      {!isLoading && !isError && (
        cars?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cars.map((car) => {
              const available = car.available ?? car.availble;
              const stock = Number(car.stock ?? 0);
              const img = car.image;
              const alt = `${car.brand} ${car.model}`;
              const disabledRent = !available || stock <= 0;
              return (
                <motion.article
                  key={car.id || car._id || car.model+car.brand}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/60 backdrop-blur-md shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
                >
                  {/* border glow */}
                  <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-cyan-500/30" />

                  {/* image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900/50">
                    {img ? (
                      <img src={img} alt={alt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" loading="lazy" sizes="(max-width: 768px) 100vw, 33vw" />
                    ) : (
                      <div className="h-full w-full grid place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.25),transparent_40%),radial-gradient(circle_at_70%_0%,rgba(14,165,233,0.25),transparent_35%)]">
                        <div className="text-slate-400 text-sm">Sin imagen</div>
                      </div>
                    )}
                    {/* gradient overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/0 to-transparent opacity-90" />

                    {/* top badges */}
                    <div className="absolute left-3 top-3 flex items-center gap-2">
                      <Badge color={available ? 'emerald' : 'amber'}>{available ? 'Disponible' : 'No disponible'}</Badge>
                      <Badge color={stock > 0 ? 'cyan' : 'rose'}>Stock: {stock}</Badge>
                    </div>
                  </div>

                  {/* content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold tracking-tight text-slate-100">
                          {car.brand} {car.model}
                        </h3>
                        <p className="text-sm text-slate-400">{car.color} • {car.age}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] uppercase text-slate-400">Precio/día</div>
                        <div className="-mt-0.5 text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">${car.price_day}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      {isAdmin ? (
                        <>
                          <Button size="sm" variant="secondary" onClick={() => openEditModal(car)} className="min-w-[96px]">Editar</Button>
                          <Button size="sm" variant="danger" onClick={() => toast('Eliminación próximamente')} className="min-w-[96px]">Eliminar</Button>
                        </>
                      ) : (
                        <Button size="sm" onClick={() => { setRentCar(car); setOpenRent(true); }}
                          disabled={disabledRent}
                          className="min-w-[110px]"
                        >
                          {disabledRent ? 'No disponible' : 'Alquilar'}
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 text-center">
            {isAdmin ? 'No hay autos cargados. Comenzá agregando uno.' : 'No hay autos disponibles en este momento.'}
          </div>
        )
      )}

      {openCreate && (
        <CreateCarModal onClose={() => setOpenCreate(false)} onSubmit={(values) => createMutation.mutate(values)} loading={createMutation.isPending} />
      )}

      {openEdit && editingCar && (
        <EditCarModal
          car={editingCar}
          onClose={() => { setOpenEdit(false); setEditingCar(null); }}
          onSubmit={(values) => updateMutation.mutate({ id: editingCar.id, values })}
          loading={updateMutation.isPending}
        />
      )}

      {openRent && rentCar && (
        <RentCarModal
          car={rentCar}
          userId={user?.id}
          onClose={() => { setOpenRent(false); setRentCar(null); }}
          onSuccess={() => { setOpenRent(false); setRentCar(null); refetch(); }}
        />
      )}
    </div>
  );
}

function CreateCarModal({ onClose, onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(carSchema),
    defaultValues: { available: true }
  });

  const imageFile = watch('image');

  return (
    <Modal open onClose={onClose} ariaLabel="Agregar auto" panelClassName="p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-400">Agregar auto</h3>
        <p className="text-sm text-slate-400 mt-1">Completá los datos del vehículo</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InputPro label="Marca" {...register('brand')} error={errors.brand?.message}
          leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><path d='M3 12h18M7 12v4m10-4v4'/></svg>}
        />
        <InputPro label="Modelo" {...register('model')} error={errors.model?.message}
          leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><path d='M4 17h16M6 13h12M8 9h8'/></svg>}
        />
        <InputPro label="Color" {...register('color')} error={errors.color?.message}
          leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><circle cx='12' cy='12' r='9'/></svg>}
        />
        <InputPro label="Año" {...register('age')} error={errors.age?.message}
          leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><path d='M3 12h18M12 3v18'/></svg>}
        />
        <InputPro label="Precio por día" type="number" step="0.01" {...register('price_day')} error={errors.price_day?.message}
          leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><path d='M12 1v22'/><path d='M17 5H9.5A3.5 3.5 0 0 0 6 8.5h0A3.5 3.5 0 0 0 9.5 12H14a3.5 3.5 0 0 1 0 7H6'/></svg>}
        />
        <InputPro label="Stock" type="number" {...register('stock')} error={errors.stock?.message}
          leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><rect x='3' y='4' width='18' height='16' rx='2'/><path d='M7 8h10M7 12h10M7 16h6'/></svg>}
        />

        <label className="flex flex-col gap-1 text-slate-200">
          <span className="text-sm text-slate-300">Disponibilidad</span>
          <select
            className="h-11 rounded-xl bg-slate-900/60 border border-slate-800/80 px-3 text-slate-100 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-500/30"
            defaultValue="true"
            {...register('available', { setValueAs: (v) => v === 'true' })}
          >
            <option value="true">Disponible</option>
            <option value="false">No disponible</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-slate-200 sm:col-span-2">
          <span className="text-sm text-slate-300">Imagen (opcional)</span>
          <input type="file" accept="image/*" className="file:mr-4 file:py-2 file:px-3 file:rounded file:border-0 file:text-sm file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
            {...register('image')} />
          {imageFile?.[0] && <span className="text-xs text-slate-400 mt-1">{imageFile[0].name}</span>}
        </label>

        <div className="sm:col-span-2 mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={loading}>Crear</Button>
        </div>
      </form>
    </Modal>
  );
}

function EditCarModal({ car, onClose, onSubmit, loading }) {
  // Pre-cargamos los valores existentes del auto; image será opcional para reemplazar
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(carSchema),
    defaultValues: {
      brand: car.brand || '',
      model: car.model || '',
      color: car.color || '',
      age: car.age || '',
      price_day: Number(car.price_day ?? 0),
      stock: Number(car.stock ?? 0),
      available: (car.available ?? car.availble) ? true : false,
      currentImageUrl: car.image || undefined,
    }
  });

  const imageFile = watch('image');

  return (
    <Modal open onClose={onClose} ariaLabel="Editar auto" panelClassName="p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-400">Editar auto</h3>
        <p className="text-sm text-slate-400 mt-1">Actualizá los datos del vehículo</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InputPro label="Marca" {...register('brand')} error={errors.brand?.message}
          leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><path d='M3 12h18M7 12v4m10-4v4'/></svg>}
        />
        <InputPro label="Modelo" {...register('model')} error={errors.model?.message}
          leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><path d='M4 17h16M6 13h12M8 9h8'/></svg>}
        />
        <InputPro label="Color" {...register('color')} error={errors.color?.message}
          leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><circle cx='12' cy='12' r='9'/></svg>}
        />
        <InputPro label="Año" {...register('age')} error={errors.age?.message}
          leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><path d='M3 12h18M12 3v18'/></svg>}
        />
        <InputPro label="Precio por día" type="number" step="0.01" {...register('price_day')} error={errors.price_day?.message}
          leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><path d='M12 1v22'/><path d='M17 5H9.5A3.5 3.5 0 0 0 6 8.5h0A3.5 3.5 0 0 0 9.5 12H14a3.5 3.5 0 0 1 0 7H6'/></svg>}
        />
        <InputPro label="Stock" type="number" {...register('stock')} error={errors.stock?.message}
          leftIcon={<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><rect x='3' y='4' width='18' height='16' rx='2'/><path d='M7 8h10M7 12h10M7 16h6'/></svg>}
        />

        <label className="flex flex-col gap-1 text-slate-200">
          <span className="text-sm text-slate-300">Disponibilidad</span>
          <select
            className="h-11 rounded-xl bg-slate-900/60 border border-slate-800/80 px-3 text-slate-100 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-500/30"
            defaultValue={(car.available ?? car.availble) ? 'true' : 'false'}
            {...register('available', { setValueAs: (v) => v === 'true' })}
          >
            <option value="true">Disponible</option>
            <option value="false">No disponible</option>
          </select>
        </label>

        <div className="sm:col-span-2">
          <label className="flex flex-col gap-1 text-slate-200">
            <span className="text-sm text-slate-300">Imagen (dejar vacío para mantener la actual)</span>
            <input type="file" accept="image/*" className="file:mr-4 file:py-2 file:px-3 file:rounded file:border-0 file:text-sm file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
              {...register('image')} />
            {imageFile?.[0] ? (
              <span className="text-xs text-slate-400 mt-1">{imageFile[0].name}</span>
            ) : car.image ? (
              <div className="mt-2 flex items-center gap-3">
                <img src={car.image} alt="Actual" className="h-16 w-24 object-cover rounded border border-slate-800" />
                <span className="text-xs text-slate-400">Imagen actual</span>
              </div>
            ) : null}
          </label>
        </div>

        <div className="sm:col-span-2 mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={loading}>Guardar cambios</Button>
        </div>
      </form>
    </Modal>
  );
}


function RentCarModal({ car, userId, onClose, onSuccess }) {
  // Traemos directamente los datos de la persona por id de usuario
  const { data: person, isLoading: loadingPerson, isError: errorPerson } = useQuery({
    queryKey: ['person-by-user', userId],
    queryFn: () => clientsService.getPersonByUserId(userId),
    enabled: Boolean(userId),
  });

  // Date range selection
  const rentSchema = z.object({
    start: z.date({ required_error: 'Fecha de inicio requerida' }),
    end: z.date({ required_error: 'Fecha de fin requerida' }),
    observation: z.string().max(300, 'Máximo 300 caracteres').optional(),
  }).refine((d) => d.end > d.start, { message: 'La fecha de fin debe ser posterior', path: ['end'] });

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
    resolver: zodResolver(rentSchema),
    defaultValues: {
      start: new Date(),
      end: new Date(Date.now() + 24*60*60*1000),
      observation: '',
    },
  });

  const start = watch('start');
  const end = watch('end');
  const dailyRate = Number(car?.price_day || 0);
  const days = computeDays(start, end);
  const total = dailyRate * (days > 0 ? days : 0);

  const { notify } = useNotifications() || { notify: () => {} };

  const createRentalMutation = useMutation({
    mutationFn: async ({ start, end, observation }) => {
      // normalize dates to noon to avoid TZ issues
      const s = new Date(start); s.setHours(12,0,0,0);
      const e = new Date(end); e.setHours(12,0,0,0);
      const start_date = s.toISOString().slice(0, 10);
      const completion_date = e.toISOString().slice(0, 10);
      const payload = {
        car_id: car.id,
        user_id: userId,
        start_date,
        completion_date,
        daily_rate: dailyRate,
        total,
        observation: observation || undefined,
      };
      const rental = await rentalsService.createRental(payload);
      return { rental, payload: { start_date, completion_date } };
    },
    onSuccess: ({ rental, payload }) => {
      // Centered neon toast
      import('react-hot-toast').then(({ default: toast }) => {
        toast.custom((t) => (
          <div className={`px-6 py-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-100 shadow-[0_0_30px_0_rgba(16,185,129,0.25)] ${t.visible ? 'animate-in fade-in zoom-in' : 'animate-out fade-out zoom-out'}`}>
            <div className="font-semibold">Reserva confirmada</div>
          </div>
        ), { duration: 2200, position: 'top-center' });
      });

      try {
        // Compose a robust rental object for PDF (fallbacks if backend omite campos)
        const fullRental = {
          ...(payload || {}),
          ...(rental || {}),
          daily_rate: (rental && rental.daily_rate != null) ? rental.daily_rate : dailyRate,
          total: (rental && rental.total != null) ? rental.total : total,
        };
        // Push in-app notification with link to PDF
        if (notify) notify({
          type: 'rental-confirmed',
          title: 'Reserva confirmada',
          message: `${car.brand} ${car.model} • Total $${Number(fullRental.total).toLocaleString('es-AR')} • ${days} día${days>1?'s':''}`,
          payload: { rental: fullRental, car, person },
        });
      } catch {}

      onSuccess?.();
    },
    onError: (e) => {
      import('react-hot-toast').then(({ default: toast }) => {
        const msg = e?.response?.data?.message || 'No se pudo crear el alquiler';
        toast.error(msg);
      });
    },
  });

  const onSubmit = (values) => createRentalMutation.mutate(values);

  return (
    <Modal open onClose={onClose} ariaLabel="Alquilar auto" panelClassName="p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-400">Confirmar alquiler</h3>
        <p className="text-sm text-slate-400 mt-1">Elegí las fechas y revisá tus datos</p>
      </div>

      {/* Car info */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-48 shrink-0 overflow-hidden rounded-md border border-slate-800 bg-slate-900/50">
          {car?.image ? (
            <img src={car.image} alt={`${car.brand} ${car.model}`} className="h-32 w-full object-cover" />
          ) : (
            <div className="h-32 w-full grid place-items-center text-slate-400 text-sm">Sin imagen</div>
          )}
        </div>
        <div className="flex-1">
          <div className="font-medium text-slate-100">{car?.brand} {car?.model}</div>
          <div className="text-sm text-slate-400">{car?.color} • {car?.age}</div>
          <div className="mt-1 text-sm text-slate-300">Precio por día: ${dailyRate}</div>
          <div className="mt-1 text-sm text-slate-300">Stock disponible: {car?.stock}</div>
        </div>
      </div>

      <div className="my-5 h-px w-full bg-slate-800" />

      {/* User info */}
      <div className="mb-4">
        <div className="text-sm font-medium text-slate-200">Tus datos</div>
        {loadingPerson ? (
          <div className="mt-2 h-12 rounded bg-slate-800/60 animate-pulse" />
        ) : errorPerson ? (
          <div className="mt-2 text-sm text-red-300">No pudimos cargar tus datos</div>
        ) : (
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">
            <div>Nombre: <span className="text-slate-100">{person?.name || '-'}</span></div>
            <div>Documento (DNI): <span className="text-slate-100">{person?.dni || '-'}</span></div>
            <div>Teléfono: <span className="text-slate-100">{person?.phone || '-'}</span></div>
            <div>Género: <span className="text-slate-100">{person?.gender || '-'}</span></div>
            <div>Fecha de nacimiento: <span className="text-slate-100">{(person?.birthday || '').slice(0,10) || '-'}</span></div>
          </div>
        )}
      </div>

      {/* Rental form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-300 mb-1">Fechas</label>
          <DateRangePicker
            start={start}
            end={end}
            onChange={({ from, to }) => {
              if (from) setValue('start', from, { shouldValidate: true });
              if (to) setValue('end', to, { shouldValidate: true });
            }}
          />
          {(errors.start || errors.end) && (
            <div className="mt-1 text-xs text-rose-400">{errors.start?.message || errors.end?.message}</div>
          )}
        </div>

        <label className="flex flex-col gap-1 text-slate-200">
          <span className="text-sm text-slate-300">Observación (opcional)</span>
          <textarea rows={3} className="rounded-xl bg-slate-900/60 border border-slate-800/80 px-3 py-2 text-slate-100 placeholder:text-slate-400 outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-500/30" placeholder="Algún detalle para el alquiler" {...register('observation')} />
          {errors.observation?.message && <span className="text-xs text-rose-400">{errors.observation.message}</span>}
        </label>

        <div className="mt-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-sm">
          <div className="flex items-center justify-between">
            <div className="text-slate-300">Total ({days} día{days > 1 ? 's' : ''})</div>
            <div className="font-semibold text-slate-100">${Number.isFinite(total) ? total : 0}</div>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={createRentalMutation.isPending}>Cancelar</Button>
          <Button type="submit" loading={createRentalMutation.isPending} disabled={loadingPerson || errorPerson || days < 1}>Confirmar</Button>
        </div>
      </form>
    </Modal>
  );
}

function computeDays(start, end) {
  try {
    const s = new Date(start); const e = new Date(end);
    s.setHours(12,0,0,0); e.setHours(12,0,0,0);
    const diff = (e - s) / (1000*60*60*24);
    return Math.max(0, Math.round(diff));
  } catch { return 0; }
}

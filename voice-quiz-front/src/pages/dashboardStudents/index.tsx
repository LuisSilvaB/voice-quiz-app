import { Scanner } from '@yudiel/react-qr-scanner';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@material-tailwind/react';

const DashboardStudents = () => {
  const navigate = useNavigate()
  return (
    <div className="flex  w-full flex-col items-start justify-start lg:justify-center lg:items-center mt-6 lg:mt-2 gap-3">  
      <div className="flex h-full max-h-[500px] w-full max-w-[500px] flex-col items-center justify-center gap-3">
        <Typography placeholder="" variant="h3" className="text-center w-full">
          Escanea el código del examen
        </Typography>
        <Typography placeholder={""} variant='paragraph' className="text-center">
          Para iniciar el examen, escanea el código del examen
        </Typography>
        <Scanner
          onScan={(data) => {
            if (data) {
              const url = new URL(data[0].rawValue);
              navigate(url.pathname);
            }
          }} 
        /> 
      </div>
    </div>
  );
}

export default DashboardStudents
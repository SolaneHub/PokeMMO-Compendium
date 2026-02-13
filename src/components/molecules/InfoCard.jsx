const InfoCard = ({ label, value, className ="", labelClass ="", valueClass ="",
}) => ( <div className={`flex flex-col justify-center rounded-lg border border-white/10 bg-white/5 p-2.5 ${className}`} > <span className={`mb-1 text-[10px] font-bold uppercase ${labelClass}`} > {label} </span> <span className={`text-sm font-semibold ${valueClass}`}> {value ||"None"} </span> </div>
); export default InfoCard; 

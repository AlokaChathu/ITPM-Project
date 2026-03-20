import { useMemo } from "react";
import { Check, X } from "lucide-react";

const PasswordStatus = ({ checks, password, score }) => {



    const strength = useMemo(() => {
        const percent = (score / 5) * 100;

        let label = "Very Weak";
        let colorClass = "bg-red-500";

        if (score === 2) {
            label = "Weak";
            colorClass = "bg-orange-500";
        } else if (score === 3) {
            label = "Medium";
            colorClass = "bg-yellow-500";
        } else if (score === 4) {
            label = "Strong";
            colorClass = "bg-sky-500";
        } else if (score === 5) {
            label = "Very Strong";
            colorClass = "bg-emerald-500";
        }

        return { percent, label, colorClass };
    }, [score]);


    return (

        <>

        {password.length > 0 && (
        <div className="mt-4 mb-4">

            
                <>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Password strength</span>
                        <span className="text-slate-200">{strength.label}</span>
                    </div>

                    <div className="h-1 w-full bg-slate-700 rounded-full mb-3">
                        <div
                            className={`h-full ${strength.colorClass} rounded-full transition-all duration-300`}
                            style={{ width: `${strength.percent}%` }}
                        />
                    </div>
                </>

           

            <ul className="text-xs space-y-1">
                <li className="flex items-center gap-2">
                    {checks.minLen ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                        <X className="w-4 h-4 text-slate-400" />
                    )}
                    <span className={checks.minLen ? "text-emerald-400" : "text-slate-400"}>
                        At least 6 characters
                    </span>
                </li>

                <li className="flex items-center gap-2">
                    {checks.upper ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                        <X className="w-4 h-4 text-slate-400" />
                    )}
                    <span className={checks.upper ? "text-emerald-400" : "text-slate-400"}>
                        Contains uppercase letter
                    </span>
                </li>

                <li className="flex items-center gap-2">
                    {checks.lower ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                        <X className="w-4 h-4 text-slate-400" />
                    )}
                    <span className={checks.lower ? "text-emerald-400" : "text-slate-400"}>
                        Contains lowercase letter
                    </span>
                </li>

                <li className="flex items-center gap-2">
                    {checks.number ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                        <X className="w-4 h-4 text-slate-400" />
                    )}
                    <span className={checks.number ? "text-emerald-400" : "text-slate-400"}>
                        Contains a number
                    </span>
                </li>

                <li className="flex items-center gap-2">
                    {checks.special ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                        <X className="w-4 h-4 text-slate-400" />
                    )}
                    <span className={checks.special ? "text-emerald-400" : "text-slate-400"}>
                        Contains special character
                    </span>
                </li>
            </ul>

           

        </div>
         )}

         </>
    )
}

export default PasswordStatus

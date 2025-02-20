
import { Settings2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Company } from "@/types/company";

interface CompanyInfoProps {
  company: Pick<Company, 'name' | 'logo_url'>;
}

export const CompanyInfo = ({ company }: CompanyInfoProps) => {
  const navigate = useNavigate();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  return (
    <div 
      className={`fixed top-0 left-0 right-0 bg-white/95 shadow-md transition-transform duration-300 z-50 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              {company.logo_url && (
                <img 
                  src={company.logo_url} 
                  alt={`${company.name} logo`}
                  className="w-12 h-12 object-contain rounded-lg"
                />
              )}
              <h2 className="text-xl font-bold text-gray-900">{company.name}</h2>
            </div>
            <button
              onClick={() => navigate("/admin")}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Painel Administrativo"
            >
              <Settings2 size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Mapeo de Emojis a Iconos de Lucide React
 * 
 * Este archivo proporciona el mapeo para reemplazar todos los emojis
 * en la aplicación con iconos apropiados de Lucide React.
 */

import {
  Tractor,
  Settings,
  BarChart3,
  Zap,
  Target,
  Search,
  Smartphone,
  Lightbulb,
  Palette,
  CheckCircle,
  XCircle,
  Rocket,
  ClipboardList,
  Star,
  Wrench,
  TrendingUp,
  RotateCcw,
  Cog,
  PartyPopper,
  Save,
  Trash2,
  FileText,
  Home,
  User,
  Package,
  AlertTriangle,
  Calendar,
  MapPin,
  Building2,
  Hash,
  Tag,
  DollarSign,
  BookOpen,
  Activity
} from 'lucide-react';

// Mapeo de emojis a iconos de Lucide React
export const EMOJI_TO_ICON_MAP = {
  // Agricultura y Maquinaria
  '🚜': Tractor,
  '🌾': Activity,
  
  // Herramientas y Configuración
  '🔧': Wrench,
  '⚙️': Settings,
  '🛠️': Cog,
  
  // Estadísticas y Datos
  '📊': BarChart3,
  '📈': TrendingUp,
  '📋': ClipboardList,
  '📦': Package,
  
  // Acciones y Estados
  '⚡': Zap,
  '🎯': Target,
  '🔍': Search,
  '💡': Lightbulb,
  '🎨': Palette,
  '✅': CheckCircle,
  '❌': XCircle,
  '🚀': Rocket,
  '⭐': Star,
  '🎉': PartyPopper,
  '💾': Save,
  '🗑️': Trash2,
  '🔄': RotateCcw,
  
  // Información y Documentos
  '📝': FileText,
  '📄': FileText,
  '📖': BookOpen,
  '📚': BookOpen,
  
  // Ubicación y Organización
  '🏠': Home,
  '📍': MapPin,
  '🏭': Building2,
  '🏷️': Tag,
  
  // Usuarios y Personas
  '👤': User,
  
  // Móvil y Tecnología
  '📱': Smartphone,
  
  // Fechas y Tiempo
  '📅': Calendar,
  
  // Números y Códigos
  '🔢': Hash,
  
  // Dinero y Costos
  '💰': DollarSign,
  
  // Alertas y Avisos
  '🚨': AlertTriangle,
  '⚠️': AlertTriangle
};

// Función para obtener el icono correspondiente
export const getIconComponent = (emoji, defaultIcon = FileText) => {
  return EMOJI_TO_ICON_MAP[emoji] || defaultIcon;
};

// Función para renderizar icono con props
export const renderIcon = (emoji, props = {}) => {
  const IconComponent = getIconComponent(emoji);
  return <IconComponent {...props} />;
};

export default EMOJI_TO_ICON_MAP;

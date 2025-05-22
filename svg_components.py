"""
SVG Component Library for SVG-MCP.

This module provides a collection of reusable SVG components inspired by SVG-Loaders.
Each component can be customized in size, color, and other parameters.
"""

from typing import Dict, Any, List, Optional, Union

# Define color palettes for consistent styling
COLOR_PALETTES = {
    "default": {
        "primary": "#3498db",
        "secondary": "#e74c3c",
        "accent": "#2ecc71",
        "neutral": "#95a5a6"
    },
    "pastel": {
        "primary": "#a2d2ff",
        "secondary": "#ffafcc",
        "accent": "#cdb4db",
        "neutral": "#bde0fe"
    },
    "dark": {
        "primary": "#2c3e50",
        "secondary": "#c0392b",
        "accent": "#27ae60",
        "neutral": "#7f8c8d"
    },
    "neon": {
        "primary": "#00ffff",
        "secondary": "#ff00ff",
        "accent": "#ffff00",
        "neutral": "#ffffff"
    },
    "grayscale": {
        "primary": "#000000",
        "secondary": "#666666",
        "accent": "#999999",
        "neutral": "#cccccc"
    }
}

def get_loaders(component_type: str, size: int = 100, color: str = None, 
               palette: str = "default", animated: bool = True) -> Dict[str, Any]:
    """
    Get SVG loaders/spinners components.
    
    Args:
        component_type: Type of loader ('bars', 'circles', 'dots', 'spinner', 'pulse')
        size: Size of the component in pixels
        color: Primary color (overrides palette color if provided)
        palette: Color palette to use
        animated: Whether to include animation
        
    Returns:
        Dictionary containing the SVG code and component information
    """
    # Get palette colors or use defaults if palette doesn't exist
    palette_colors = COLOR_PALETTES.get(palette, COLOR_PALETTES["default"])
    
    # Use provided color or default to palette primary color
    primary_color = color if color else palette_colors["primary"]
    secondary_color = palette_colors["secondary"]
    accent_color = palette_colors["accent"]
    
    # Animation duration
    duration = 1000 if animated else 0
    animation_attr = "" if not animated else f' dur="{duration}ms" repeatCount="indefinite"'
    
    svg_code = ""
    viewBox = f"0 0 {size} {size}"
    
    if component_type == "bars":
        bar_width = size / 10
        bar_spacing = size / 20
        bar_height = size * 0.6
        start_x = (size - ((bar_width * 5) + (bar_spacing * 4))) / 2
        start_y = (size - bar_height) / 2
        
        svg_code = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewBox}" width="{size}" height="{size}">\n'
        
        for i in range(5):
            x = start_x + (i * (bar_width + bar_spacing))
            y = start_y + bar_height
            
            if animated:
                anim_values = f"{bar_height};{bar_height/4};{bar_height}"
                anim_begin = f"{(i * 0.1)}s"
                animation = f'<animate attributeName="height" values="{anim_values}"{animation_attr} begin="{anim_begin}"/>\n'
                animation += f'<animate attributeName="y" values="{y-bar_height};{y-bar_height/4};{y-bar_height}"{animation_attr} begin="{anim_begin}"/>'
            else:
                animation = ""
            
            svg_code += f'  <rect x="{x}" y="{y-bar_height}" width="{bar_width}" height="{bar_height}" fill="{primary_color}">\n'
            if animation:
                svg_code += f'    {animation}\n'
            svg_code += f'  </rect>\n'
        
        svg_code += '</svg>'
    
    elif component_type == "circles":
        circle_radius = size / 12
        center = size / 2
        orbit_radius = size / 3
        
        svg_code = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewBox}" width="{size}" height="{size}">\n'
        
        for i in range(8):
            angle = i * 45
            if animated:
                anim_begin = f"{(i * 0.125)}s"
                animation = f'<animate attributeName="opacity" values="1;0.2;1"{animation_attr} begin="{anim_begin}"/>\n'
            else:
                animation = ""
            
            x = center + orbit_radius * math.cos(math.radians(angle))
            y = center + orbit_radius * math.sin(math.radians(angle))
            
            svg_code += f'  <circle cx="{x}" cy="{y}" r="{circle_radius}" fill="{primary_color}">\n'
            if animation:
                svg_code += f'    {animation}\n'
            svg_code += f'  </circle>\n'
        
        svg_code += '</svg>'
    
    elif component_type == "dots":
        dot_radius = size / 10
        spacing = size / 5
        
        svg_code = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewBox}" width="{size}" height="{size}">\n'
        
        for i in range(3):
            x = (size / 2) + (i - 1) * spacing
            y = size / 2
            
            if animated:
                anim_begin = f"{(i * 0.15)}s"
                animation = f'<animate attributeName="cy" values="{y};{y-spacing/2};{y}"{animation_attr} begin="{anim_begin}"/>\n'
                animation += f'<animate attributeName="fill" values="{primary_color};{secondary_color};{primary_color}"{animation_attr} begin="{anim_begin}"/>'
            else:
                animation = ""
            
            svg_code += f'  <circle cx="{x}" cy="{y}" r="{dot_radius}" fill="{primary_color}">\n'
            if animation:
                svg_code += f'    {animation}\n'
            svg_code += f'  </circle>\n'
        
        svg_code += '</svg>'
    
    elif component_type == "spinner":
        stroke_width = size / 20
        radius = (size / 2) - stroke_width
        circumference = 2 * math.pi * radius
        
        svg_code = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewBox}" width="{size}" height="{size}">\n'
        
        if animated:
            animation = f'<animateTransform attributeName="transform" type="rotate" values="0 {size/2} {size/2};360 {size/2} {size/2}"{animation_attr}/>'
        else:
            animation = ""
        
        svg_code += f'  <circle cx="{size/2}" cy="{size/2}" r="{radius}" fill="none" stroke="{palette_colors["neutral"]}" stroke-width="{stroke_width}" opacity="0.3"/>\n'
        svg_code += f'  <path d="M {size/2} {stroke_width} A {radius} {radius} 0 0 1 {size-stroke_width} {size/2}" fill="none" stroke="{primary_color}" stroke-width="{stroke_width}" stroke-linecap="round">\n'
        
        if animation:
            svg_code += f'    {animation}\n'
        
        svg_code += f'  </path>\n'
        svg_code += '</svg>'
    
    elif component_type == "pulse":
        circle_radius = size / 6
        center = size / 2
        
        svg_code = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewBox}" width="{size}" height="{size}">\n'
        
        if animated:
            animation1 = f'<animate attributeName="r" values="{circle_radius};{circle_radius*2};{circle_radius}"{animation_attr}/>\n'
            animation2 = f'<animate attributeName="opacity" values="1;0;1"{animation_attr}/>'
        else:
            animation1 = ""
            animation2 = ""
        
        svg_code += f'  <circle cx="{center}" cy="{center}" r="{circle_radius}" fill="{primary_color}">\n'
        if animation1:
            svg_code += f'    {animation1}\n'
        if animation2:
            svg_code += f'    {animation2}\n'
        svg_code += f'  </circle>\n'
        svg_code += '</svg>'
    
    else:
        # Default to a simple spinner if component type is not recognized
        svg_code = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewBox}" width="{size}" height="{size}">\n'
        
        if animated:
            animation = f'<animateTransform attributeName="transform" type="rotate" values="0 {size/2} {size/2};360 {size/2} {size/2}"{animation_attr}/>'
        else:
            animation = ""
        
        svg_code += f'  <circle cx="{size/2}" cy="{size/2}" r="{size/3}" fill="none" stroke="{primary_color}" stroke-width="{size/12}" stroke-dasharray="{size/3}">\n'
        
        if animation:
            svg_code += f'    {animation}\n'
        
        svg_code += f'  </circle>\n'
        svg_code += '</svg>'
    
    return {
        "svg_code": svg_code,
        "component_type": component_type,
        "size": size,
        "color": primary_color,
        "palette": palette,
        "animated": animated
    }


def get_icons(icon_name: str, size: int = 24, color: str = None, 
             palette: str = "default", stroke_width: int = 2) -> Dict[str, Any]:
    """
    Get SVG icon components.
    
    Args:
        icon_name: Name of the icon ('arrow', 'alert', 'check', 'cross', 'info')
        size: Size of the icon in pixels
        color: Primary color (overrides palette color if provided)
        palette: Color palette to use
        stroke_width: Width of the stroke lines
        
    Returns:
        Dictionary containing the SVG code and component information
    """
    # Get palette colors or use defaults if palette doesn't exist
    palette_colors = COLOR_PALETTES.get(palette, COLOR_PALETTES["default"])
    
    # Use provided color or default to palette primary color
    primary_color = color if color else palette_colors["primary"]
    
    viewBox = "0 0 24 24"
    svg_code = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewBox}" width="{size}" height="{size}" fill="none" stroke="{primary_color}" stroke-width="{stroke_width}" stroke-linecap="round" stroke-linejoin="round">\n'
    
    if icon_name == "arrow":
        svg_code += '  <line x1="5" y1="12" x2="19" y2="12" />\n'
        svg_code += '  <polyline points="12 5 19 12 12 19" />\n'
    
    elif icon_name == "alert":
        svg_code += '  <circle cx="12" cy="12" r="10" />\n'
        svg_code += '  <line x1="12" y1="8" x2="12" y2="12" />\n'
        svg_code += '  <line x1="12" y1="16" x2="12.01" y2="16" />\n'
    
    elif icon_name == "check":
        svg_code += '  <polyline points="20 6 9 17 4 12" />\n'
    
    elif icon_name == "cross":
        svg_code += '  <line x1="18" y1="6" x2="6" y2="18" />\n'
        svg_code += '  <line x1="6" y1="6" x2="18" y2="18" />\n'
    
    elif icon_name == "info":
        svg_code += '  <circle cx="12" cy="12" r="10" />\n'
        svg_code += '  <line x1="12" y1="16" x2="12" y2="12" />\n'
        svg_code += '  <line x1="12" y1="8" x2="12.01" y2="8" />\n'
    
    else:
        # Default to a simple circle if icon name is not recognized
        svg_code += '  <circle cx="12" cy="12" r="10" />\n'
    
    svg_code += '</svg>'
    
    return {
        "svg_code": svg_code,
        "icon_name": icon_name,
        "size": size,
        "color": primary_color,
        "palette": palette,
        "stroke_width": stroke_width
    }


def get_backgrounds(pattern_type: str, size: int = 100, 
                   color: str = None, palette: str = "default") -> Dict[str, Any]:
    """
    Get SVG background pattern components.
    
    Args:
        pattern_type: Type of pattern ('grid', 'dots', 'waves', 'stripes', 'geometric')
        size: Size of the pattern in pixels
        color: Primary color (overrides palette color if provided)
        palette: Color palette to use
        
    Returns:
        Dictionary containing the SVG code and component information
    """
    # Get palette colors or use defaults if palette doesn't exist
    palette_colors = COLOR_PALETTES.get(palette, COLOR_PALETTES["default"])
    
    # Use provided color or default to palette primary color
    primary_color = color if color else palette_colors["primary"]
    secondary_color = palette_colors["secondary"]
    accent_color = palette_colors["accent"]
    neutral_color = palette_colors["neutral"]
    
    pattern_id = f"pattern-{pattern_type}"
    viewBox = f"0 0 {size} {size}"
    
    svg_code = f'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">\n'
    svg_code += f'  <defs>\n'
    svg_code += f'    <pattern id="{pattern_id}" viewBox="{viewBox}" width="{size/500}" height="{size/500}" patternUnits="objectBoundingBox">\n'
    
    if pattern_type == "grid":
        svg_code += f'      <path d="M {size} 0 L 0 0 0 {size}" fill="none" stroke="{primary_color}" stroke-width="1" />\n'
    
    elif pattern_type == "dots":
        dot_size = size / 20
        spacing = size / 5
        
        for x in range(0, size, int(spacing)):
            for y in range(0, size, int(spacing)):
                svg_code += f'      <circle cx="{x}" cy="{y}" r="{dot_size}" fill="{primary_color}" />\n'
    
    elif pattern_type == "waves":
        amplitude = size / 10
        frequency = 3
        points = []
        
        for x in range(0, size + 1, int(size / 20)):
            y = amplitude * math.sin((x / size) * frequency * 2 * math.pi) + (size / 2)
            points.append(f"{x},{y}")
        
        svg_code += f'      <polyline points="{" ".join(points)}" fill="none" stroke="{primary_color}" stroke-width="2" />\n'
    
    elif pattern_type == "stripes":
        stripe_width = size / 10
        
        for i in range(0, size, int(stripe_width * 2)):
            svg_code += f'      <rect x="{i}" y="0" width="{stripe_width}" height="{size}" fill="{primary_color}" opacity="0.5" />\n'
    
    elif pattern_type == "geometric":
        svg_code += f'      <polygon points="0,0 {size},0 {size/2},{size/2}" fill="{primary_color}" opacity="0.3" />\n'
        svg_code += f'      <polygon points="0,{size} {size},{size} {size/2},{size/2}" fill="{secondary_color}" opacity="0.3" />\n'
        svg_code += f'      <polygon points="0,0 0,{size} {size/2},{size/2}" fill="{accent_color}" opacity="0.3" />\n'
        svg_code += f'      <polygon points="{size},0 {size},{size} {size/2},{size/2}" fill="{neutral_color}" opacity="0.3" />\n'
    
    else:
        # Default to a simple grid if pattern type is not recognized
        svg_code += f'      <path d="M {size} 0 L 0 0 0 {size}" fill="none" stroke="{primary_color}" stroke-width="1" />\n'
    
    svg_code += f'    </pattern>\n'
    svg_code += f'  </defs>\n'
    svg_code += f'  <rect width="100%" height="100%" fill="url(#{pattern_id})" />\n'
    svg_code += '</svg>'
    
    return {
        "svg_code": svg_code,
        "pattern_type": pattern_type,
        "size": size,
        "color": primary_color,
        "palette": palette
    }


def get_svg_component(component_type: str, variant: str, size: int = 100, 
                     color: str = None, palette: str = "default", **kwargs) -> Dict[str, Any]:
    """
    Main function to get SVG components.
    
    Args:
        component_type: Category of component ('loader', 'icon', 'background')
        variant: Specific variant of the component
        size: Size of the component in pixels
        color: Primary color (overrides palette color if provided)
        palette: Color palette to use
        **kwargs: Additional parameters specific to each component type
        
    Returns:
        Dictionary containing the SVG code and component information
    """
    if component_type == "loader":
        animated = kwargs.get("animated", True)
        return get_loaders(variant, size, color, palette, animated)
    
    elif component_type == "icon":
        stroke_width = kwargs.get("stroke_width", 2)
        return get_icons(variant, size, color, palette, stroke_width)
    
    elif component_type == "background":
        return get_backgrounds(variant, size, color, palette)
    
    else:
        # If component type is not recognized, return a default SVG with error message
        svg_code = f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 {size} {size}">\n'
        svg_code += f'  <rect width="{size}" height="{size}" fill="#f8d7da" />\n'
        svg_code += f'  <text x="{size/2}" y="{size/2}" font-family="Arial" font-size="{size/10}" text-anchor="middle" fill="#721c24">Unknown Component</text>\n'
        svg_code += '</svg>'
        
        return {
            "svg_code": svg_code,
            "error": f"Unknown component type: {component_type}",
            "size": size
        }

# Import required for math functions
import math
"""
SVG Optimization Module for SVG-MCP.

This module provides functions for optimizing SVG code based on SVGO principles.
It reduces file size while preserving visual quality.
"""

import re
from typing import Dict, Any, List, Optional, Tuple


def remove_comments(svg_code: str) -> str:
    """Remove comments from SVG code."""
    return re.sub(r'<!--[\s\S]*?-->', '', svg_code)


def remove_metadata(svg_code: str) -> str:
    """Remove metadata elements from SVG code."""
    return re.sub(r'<metadata>[\s\S]*?</metadata>', '', svg_code)


def remove_empty_attributes(svg_code: str) -> str:
    """Remove empty attributes from SVG elements."""
    return re.sub(r'\s+(\w+)=[\'"]{2}', '', svg_code)


def remove_editor_namespaces(svg_code: str) -> str:
    """Remove editor-specific namespace declarations."""
    pattern = r'xmlns:(inkscape|sodipodi|adobe|ai|graph|sketch)="[^"]*"'
    return re.sub(pattern, '', svg_code)


def collapse_empty_groups(svg_code: str) -> str:
    """Collapse empty or unnecessary groups."""
    # Remove empty groups
    cleaned = re.sub(r'<g[^>]*>\s*</g>', '', svg_code)
    # Remove groups with just one element (move attributes to the child if any)
    cleaned = re.sub(r'<g([^>]*)>\s*(<[^>]+[^/]>)([\s\S]*?)</\2>\s*</g>', 
                     lambda m: f'<{m.group(2).strip()[1:-1]} {m.group(1).strip()}>{m.group(3)}</{m.group(2).strip()[1:-1]}>',
                     cleaned)
    return cleaned


def minimize_decimal_places(svg_code: str, precision: int = 2) -> str:
    """Reduce decimal precision in SVG attributes."""
    def replace_number(match):
        num = float(match.group(0))
        # Avoid scientific notation for small numbers
        if abs(num) < 1e-precision:
            return "0"
        # Format to desired precision
        return f"{num:.{precision}f}".rstrip('0').rstrip('.') if '.' in f"{num:.{precision}f}" else f"{num:.0f}"
    
    # Match numeric values in attributes while preserving non-numeric parts
    pattern = r'((?<=["\s:;,]))-?\d+\.\d+(?=["\s:;,])'
    return re.sub(pattern, replace_number, svg_code)


def remove_unnecessary_whitespace(svg_code: str) -> str:
    """Remove extra whitespace while preserving structure."""
    # Trim whitespace between tags
    cleaned = re.sub(r'>\s+<', '><', svg_code)
    # Trim whitespace around attribute values
    cleaned = re.sub(r'\s*=\s*(["\'])', r'=\1', cleaned)
    # Normalize whitespace in tags
    cleaned = re.sub(r'<\s+', '<', cleaned)
    cleaned = re.sub(r'\s+>', '>', cleaned)
    # Compress multiple spaces
    cleaned = re.sub(r'\s{2,}', ' ', cleaned)
    return cleaned


def convert_styles_to_attributes(svg_code: str) -> str:
    """Convert inline style attributes to SVG attributes when beneficial."""
    # Process style attributes like style="fill:red; stroke:blue"
    def style_to_attrs(match):
        tag = match.group(1)
        attrs = match.group(2)
        style = match.group(3)
        
        # Don't convert if style contains variables or complex values
        if 'var(' in style or 'calc(' in style:
            return match.group(0)
        
        # Parse style into attribute pairs
        style_pairs = [pair.strip() for pair in style.split(';') if pair.strip()]
        new_attrs = []
        
        for pair in style_pairs:
            if ':' in pair:
                prop, value = pair.split(':', 1)
                prop = prop.strip()
                value = value.strip()
                
                # Only convert simple properties, avoiding complex CSS properties
                if prop in ['fill', 'stroke', 'stroke-width', 'opacity', 'font-size', 
                           'font-family', 'font-weight', 'text-anchor']:
                    new_attrs.append(f'{prop}="{value}"')
                else:
                    # Keep complex properties in style
                    new_attrs.append(f'{prop}:{value}')
        
        # If we converted all properties, remove style attribute
        if all(':' not in attr for attr in new_attrs):
            return f'<{tag} {attrs} {" ".join(new_attrs)}>'
        else:
            # Otherwise keep style with unconverted properties
            style_attrs = '; '.join([attr for attr in new_attrs if ':' in attr])
            normal_attrs = ' '.join([attr for attr in new_attrs if ':' not in attr])
            return f'<{tag} {attrs} {normal_attrs} style="{style_attrs}">'
    
    pattern = r'<(\w+)([^>]*?)\s+style=["\']([^"\']*)["\']([^>]*)>'
    return re.sub(pattern, style_to_attrs, svg_code)


def optimize_path_data(svg_code: str) -> str:
    """Optimize path data in SVG paths."""
    def optimize_path(match):
        tag = match.group(1)
        attrs = match.group(2)
        path_data = match.group(3)
        
        # Simplify consecutive commands of the same type
        # Ex: "M10 10 L20 20 L30 30" -> "M10 10 L20 20 30 30"
        simplified = re.sub(r'([MLHVCSQTAmlhvcsqta])[^MLHVCSQTAmlhvcsqta]*((?:\s*-?\d+(?:\.\d+)?)+\s*)([MLHVCSQTAmlhvcsqta])', 
                           r'\1\2\3', path_data)
        
        # Replace relative with absolute when it saves space (only for simple cases)
        # This is a simplified optimization - full path optimization would be more complex
        
        return f'<{tag}{attrs}d="{simplified}"{match.group(4)}>'
    
    pattern = r'<(\w+)(\s+[^>]*?)d=(["\'])([^"\']+)(["\'])([^>]*)>'
    return re.sub(pattern, optimize_path, svg_code)


def optimize_svg(svg_code: str, level: str = "standard") -> Dict[str, Any]:
    """
    Optimize SVG code based on SVGO principles.
    
    Args:
        svg_code: The SVG code to optimize
        level: Optimization level ('light', 'standard', 'aggressive')
        
    Returns:
        A dictionary containing the optimized SVG and statistics
    """
    original_size = len(svg_code.encode('utf-8'))
    
    # Apply optimizations based on level
    if level == "light":
        # Basic non-destructive optimizations
        svg_code = remove_comments(svg_code)
        svg_code = remove_metadata(svg_code)
        svg_code = remove_empty_attributes(svg_code)
        svg_code = remove_editor_namespaces(svg_code)
        svg_code = remove_unnecessary_whitespace(svg_code)
    
    elif level == "standard" or level == "default":
        # Standard optimizations
        svg_code = remove_comments(svg_code)
        svg_code = remove_metadata(svg_code)
        svg_code = remove_empty_attributes(svg_code)
        svg_code = remove_editor_namespaces(svg_code)
        svg_code = collapse_empty_groups(svg_code)
        svg_code = minimize_decimal_places(svg_code, precision=3)
        svg_code = remove_unnecessary_whitespace(svg_code)
    
    elif level == "aggressive":
        # Maximum optimization
        svg_code = remove_comments(svg_code)
        svg_code = remove_metadata(svg_code)
        svg_code = remove_empty_attributes(svg_code)
        svg_code = remove_editor_namespaces(svg_code)
        svg_code = collapse_empty_groups(svg_code)
        svg_code = convert_styles_to_attributes(svg_code)
        svg_code = optimize_path_data(svg_code)
        svg_code = minimize_decimal_places(svg_code, precision=2)
        svg_code = remove_unnecessary_whitespace(svg_code)
    
    # Calculate optimization statistics
    optimized_size = len(svg_code.encode('utf-8'))
    saved_bytes = original_size - optimized_size
    percentage = round((saved_bytes / original_size) * 100, 2) if original_size > 0 else 0
    
    return {
        "optimized_svg": svg_code,
        "stats": {
            "original_size_bytes": original_size,
            "optimized_size_bytes": optimized_size,
            "bytes_saved": saved_bytes,
            "percentage_reduction": percentage,
            "optimization_level": level
        }
    }
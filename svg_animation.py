"""
SVG Animation Module for SVG-MCP.

This module provides functions for generating SVG animations inspired by Snap.svg.
It supports different animation types and durations.
"""

from typing import Dict, Any, List, Optional, Union

def generate_simple_animation(prompt: str, duration: int = 2000, 
                              animation_type: str = "simple") -> Dict[str, str]:
    """
    Generate a simple SVG animation based on a prompt.
    
    Args:
        prompt: Description of the desired animation
        duration: Duration of the animation in milliseconds
        animation_type: Type of animation ('simple', 'loop', 'bounce', 'complex')
        
    Returns:
        Dictionary containing the SVG code and animation information
    """
    # Default colors for animations
    primary_color = "#0077b6"
    secondary_color = "#48cae4"
    accent_color = "#fb8500"
    background_color = "#caf0f8"
    text_color = "#03045e"
    
    # Extract style cues from prompt
    style_cues = {
        "cyberpunk": ["cyberpunk", "neon", "futuristic", "tech"],
        "minimalist": ["minimalist", "minimal", "clean", "simple"],
        "nature": ["nature", "organic", "water", "plant", "flower"],
        "retro": ["retro", "vintage", "80s", "90s"]
    }
    
    # Adjust colors based on style cues
    prompt_lower = prompt.lower()
    
    for style, keywords in style_cues.items():
        if any(keyword in prompt_lower for keyword in keywords):
            if style == "cyberpunk":
                primary_color = "#00ffff"
                secondary_color = "#ff00ff"
                accent_color = "#00ff88"
                background_color = "#111122"
                text_color = "#ffffff"
                break
            elif style == "minimalist":
                primary_color = "#000000"
                secondary_color = "#ffffff"
                accent_color = "#ff3333"
                background_color = "#f7f7f7"
                text_color = "#333333"
                break
            elif style == "nature":
                primary_color = "#2d6a4f"
                secondary_color = "#40916c"
                accent_color = "#95d5b2"
                background_color = "#d8f3dc"
                text_color = "#1b4332"
                break
            elif style == "retro":
                primary_color = "#f8333c"
                secondary_color = "#44af69"
                accent_color = "#fcab10"
                background_color = "#2b9eb3"
                text_color = "#dbd5b5"
                break
    
    # Extract object cues from prompt
    objects = {
        "circle": any(word in prompt_lower for word in ["circle", "round", "dot", "ball"]),
        "square": any(word in prompt_lower for word in ["square", "rectangle", "box"]),
        "text": any(word in prompt_lower for word in ["text", "word", "letter"]),
        "line": any(word in prompt_lower for word in ["line", "path", "stroke"]),
        "symbol": any(word in prompt_lower for word in ["symbol", "icon", "logo"])
    }
    
    # Default to circle if no specific object is mentioned
    if not any(objects.values()):
        objects["circle"] = True
    
    # Generate SVG code based on animation type
    svg_code = ""
    
    if animation_type == "simple":
        if objects["circle"]:
            svg_code = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
    <circle cx="150" cy="150" r="50" fill="{primary_color}">
        <animate attributeName="r" values="50;80;50" dur="{duration}ms" repeatCount="indefinite" />
        <animate attributeName="fill" values="{primary_color};{secondary_color};{primary_color}" dur="{duration}ms" repeatCount="indefinite" />
    </circle>
</svg>"""
        elif objects["square"]:
            svg_code = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
    <rect x="100" y="100" width="100" height="100" fill="{primary_color}">
        <animate attributeName="width" values="100;150;100" dur="{duration}ms" repeatCount="indefinite" />
        <animate attributeName="height" values="100;150;100" dur="{duration}ms" repeatCount="indefinite" />
        <animate attributeName="x" values="100;75;100" dur="{duration}ms" repeatCount="indefinite" />
        <animate attributeName="y" values="100;75;100" dur="{duration}ms" repeatCount="indefinite" />
        <animate attributeName="fill" values="{primary_color};{secondary_color};{primary_color}" dur="{duration}ms" repeatCount="indefinite" />
    </rect>
</svg>"""
        elif objects["text"]:
            svg_code = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
    <text x="150" y="150" font-family="Arial" font-size="48" text-anchor="middle" fill="{primary_color}">
        Animated
        <animate attributeName="font-size" values="48;72;48" dur="{duration}ms" repeatCount="indefinite" />
        <animate attributeName="fill" values="{primary_color};{secondary_color};{primary_color}" dur="{duration}ms" repeatCount="indefinite" />
    </text>
</svg>"""
        elif objects["line"]:
            svg_code = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
    <line x1="50" y1="150" x2="250" y2="150" stroke="{primary_color}" stroke-width="10" stroke-linecap="round">
        <animate attributeName="stroke-width" values="10;20;10" dur="{duration}ms" repeatCount="indefinite" />
        <animate attributeName="stroke" values="{primary_color};{secondary_color};{primary_color}" dur="{duration}ms" repeatCount="indefinite" />
    </line>
</svg>"""
        elif objects["symbol"]:
            svg_code = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
    <g transform="translate(150, 150)">
        <path d="M0,-50 L40,40 L-40,40 Z" fill="{primary_color}">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="{duration}ms" repeatCount="indefinite" />
            <animate attributeName="fill" values="{primary_color};{secondary_color};{primary_color}" dur="{duration}ms" repeatCount="indefinite" />
        </path>
    </g>
</svg>"""
    
    elif animation_type == "loop":
        if objects["circle"]:
            svg_code = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
    <circle cx="150" cy="150" r="20" fill="{primary_color}">
        <animate attributeName="cx" values="50;250;50" dur="{duration}ms" repeatCount="indefinite" />
        <animate attributeName="cy" values="50;250;50" dur="{duration}ms" repeatCount="indefinite" />
        <animate attributeName="r" values="20;40;20" dur="{duration}ms" repeatCount="indefinite" />
    </circle>
</svg>"""
        elif objects["square"]:
            svg_code = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
    <rect x="130" y="130" width="40" height="40" fill="{primary_color}">
        <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="{duration}ms" repeatCount="indefinite" />
        <animate attributeName="fill" values="{primary_color};{secondary_color};{accent_color};{primary_color}" dur="{duration}ms" repeatCount="indefinite" />
    </rect>
</svg>"""
        elif objects["text"]:
            svg_code = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
    <text x="150" y="150" font-family="Arial" font-size="24" text-anchor="middle" fill="{primary_color}">
        Looping
        <animateTransform attributeName="transform" type="translate" values="0,0; 0,-20; 0,0" dur="{duration}ms" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.5;1" dur="{duration}ms" repeatCount="indefinite" />
    </text>
</svg>"""
        elif objects["line"]:
            svg_code = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
    <path d="M50,150 Q150,50 250,150" stroke="{primary_color}" stroke-width="5" fill="none">
        <animate attributeName="d" values="M50,150 Q150,50 250,150; M50,150 Q150,250 250,150; M50,150 Q150,50 250,150" dur="{duration}ms" repeatCount="indefinite" />
    </path>
</svg>"""
        elif objects["symbol"]:
            svg_code = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
    <g>
        <circle cx="150" cy="150" r="50" fill="none" stroke="{primary_color}" stroke-width="2" />
        <path d="M150,100 L150,150 L200,150" stroke="{secondary_color}" stroke-width="4" fill="none">
            <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="{duration}ms" repeatCount="indefinite" />
        </path>
    </g>
</svg>"""
    
    elif animation_type == "bounce":
        if objects["circle"]:
            svg_code = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
    <circle cx="150" cy="50" r="30" fill="{primary_color}">
        <animate attributeName="cy" values="50; 250; 50" dur="{duration}ms" repeatCount="indefinite" keyTimes="0; 0.5; 1" keySplines="0.1 0.8 0.2 1; 0.1 0.8 0.2 1" calcMode="spline" />
    </circle>
    <line x1="50" y1="250" x2="250" y2="250" stroke="{secondary_color}" stroke-width="2" />
</svg>"""
        elif objects["square"]:
            svg_code = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
    <rect x="125" y="50" width="50" height="50" fill="{primary_color}">
        <animate attributeName="y" values="50; 200; 50" dur="{duration}ms" repeatCount="indefinite" keyTimes="0; 0.5; 1" keySplines="0.1 0.8 0.2 1; 0.1 0.8 0.2 1" calcMode="spline" />
        <animateTransform attributeName="transform" type="rotate" values="0 150 75; 360 150 225; 0 150 75" dur="{duration}ms" repeatCount="indefinite" />
    </rect>
    <line x1="50" y1="250" x2="250" y2="250" stroke="{secondary_color}" stroke-width="2" />
</svg>"""
        elif objects["text"]:
            svg_code = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
    <text x="150" y="150" font-family="Arial" font-size="32" text-anchor="middle" fill="{primary_color}">
        Bounce
        <animate attributeName="y" values="150; 200; 150" dur="{duration}ms" repeatCount="indefinite" keyTimes="0; 0.5; 1" keySplines="0.1 0.8 0.2 1; 0.1 0.8 0.2 1" calcMode="spline" />
        <animate attributeName="font-size" values="32; 28; 32" dur="{duration}ms" repeatCount="indefinite" keyTimes="0; 0.5; 1" />
    </text>
</svg>"""
        else:
            svg_code = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
    <circle cx="150" cy="50" r="30" fill="{primary_color}">
        <animate attributeName="cy" values="50; 250; 50" dur="{duration}ms" repeatCount="indefinite" keyTimes="0; 0.5; 1" keySplines="0.1 0.8 0.2 1; 0.1 0.8 0.2 1" calcMode="spline" />
    </circle>
    <line x1="50" y1="250" x2="250" y2="250" stroke="{secondary_color}" stroke-width="2" />
</svg>"""
    
    elif animation_type == "complex":
        if objects["circle"] or objects["square"]:
            svg_code = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
    <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
    </defs>
    <g>
        <!-- Background elements -->
        <circle cx="150" cy="150" r="100" fill="none" stroke="{secondary_color}" stroke-width="1">
            <animate attributeName="r" values="100;120;100" dur="{duration*1.5}ms" repeatCount="indefinite" />
        </circle>
        <circle cx="150" cy="150" r="70" fill="none" stroke="{secondary_color}" stroke-width="1">
            <animate attributeName="r" values="70;90;70" dur="{duration}ms" repeatCount="indefinite" />
        </circle>
        
        <!-- Animated particles -->
        <g>
            <circle cx="150" cy="150" r="15" fill="{primary_color}" filter="url(#glow)">
                <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="{duration}ms" repeatCount="indefinite" />
                <animate attributeName="r" values="15;20;15" dur="{duration/2}ms" repeatCount="indefinite" />
            </circle>
            <circle cx="150" cy="80" r="8" fill="{accent_color}" filter="url(#glow)">
                <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="{duration*1.5}ms" repeatCount="indefinite" />
                <animate attributeName="r" values="8;12;8" dur="{duration/3}ms" repeatCount="indefinite" />
            </circle>
            <circle cx="150" cy="190" r="10" fill="{primary_color}" filter="url(#glow)">
                <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="-360 150 150" dur="{duration*1.2}ms" repeatCount="indefinite" />
            </circle>
        </g>
    </g>
</svg>"""
        elif objects["text"]:
            svg_code = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
    <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
    </defs>
    <mask id="mask1">
        <rect width="300" height="300" fill="white"/>
        <text x="150" y="150" font-family="Arial" font-size="48" text-anchor="middle" fill="black">Animate</text>
    </mask>
    <rect width="300" height="300" fill="{background_color}" />
    <rect width="300" height="300" fill="{primary_color}" mask="url(#mask1)">
        <animate attributeName="fill" values="{primary_color};{secondary_color};{accent_color};{primary_color}" dur="{duration}ms" repeatCount="indefinite" />
    </rect>
    <text x="150" y="150" font-family="Arial" font-size="48" text-anchor="middle" fill="transparent" stroke="{text_color}" stroke-width="1">
        Animate
        <animate attributeName="stroke-width" values="1;2;1" dur="{duration/2}ms" repeatCount="indefinite" />
    </text>
</svg>"""
        else:
            svg_code = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
    <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="{primary_color}">
                <animate attributeName="stop-color" values="{primary_color};{secondary_color};{primary_color}" dur="{duration}ms" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stop-color="{accent_color}">
                <animate attributeName="stop-color" values="{accent_color};{primary_color};{accent_color}" dur="{duration}ms" repeatCount="indefinite" />
            </stop>
        </linearGradient>
    </defs>
    <rect x="50" y="50" width="200" height="200" fill="url(#gradient)">
        <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="{duration*3}ms" repeatCount="indefinite" />
    </rect>
    <path d="M50,150 Q150,50 250,150 T50,150" fill="none" stroke="{secondary_color}" stroke-width="3">
        <animate attributeName="d" values="M50,150 Q150,50 250,150 T50,150; M50,150 Q150,250 250,150 T50,150; M50,150 Q150,50 250,150 T50,150" dur="{duration}ms" repeatCount="indefinite" />
    </path>
</svg>"""
    
    # Return the generated SVG animation
    return {
        "svg_code": svg_code,
        "animation_type": animation_type,
        "duration": duration,
        "prompt": prompt
    }


def extract_animation_elements(prompt: str) -> Dict[str, Any]:
    """
    Extract animation elements from a prompt description.
    
    Args:
        prompt: Description of the desired animation
        
    Returns:
        Dictionary containing animation elements (objects, effects, colors, etc.)
    """
    prompt_lower = prompt.lower()
    
    animation_elements = {
        "objects": [],
        "effects": [],
        "colors": [],
        "movement": [],
        "timing": "normal"
    }
    
    # Detect objects
    object_keywords = {
        "circle": ["circle", "ball", "sphere", "dot", "bubble"],
        "square": ["square", "rectangle", "box", "block"],
        "triangle": ["triangle", "pyramid"],
        "star": ["star", "sparkle"],
        "heart": ["heart", "love"],
        "text": ["text", "word", "letter", "write"],
        "line": ["line", "path", "curve", "stroke"],
        "icon": ["icon", "symbol", "logo"]
    }
    
    for obj, keywords in object_keywords.items():
        if any(keyword in prompt_lower for keyword in keywords):
            animation_elements["objects"].append(obj)
    
    # Detect effects
    effect_keywords = {
        "glow": ["glow", "shine", "radiate", "luminous"],
        "blur": ["blur", "fuzzy", "soft"],
        "shadow": ["shadow", "dark", "shade"],
        "gradient": ["gradient", "color change", "fade"],
        "pulse": ["pulse", "throb", "beat"],
        "morph": ["morph", "transform", "change shape"]
    }
    
    for effect, keywords in effect_keywords.items():
        if any(keyword in prompt_lower for keyword in keywords):
            animation_elements["effects"].append(effect)
    
    # Detect colors
    color_keywords = {
        "red": ["red", "crimson", "scarlet"],
        "blue": ["blue", "azure", "navy"],
        "green": ["green", "emerald", "lime"],
        "yellow": ["yellow", "gold", "amber"],
        "purple": ["purple", "violet", "lavender"],
        "orange": ["orange", "tangerine"],
        "black": ["black", "dark"],
        "white": ["white", "light"]
    }
    
    for color, keywords in color_keywords.items():
        if any(keyword in prompt_lower for keyword in keywords):
            animation_elements["colors"].append(color)
    
    # Detect movement
    movement_keywords = {
        "rotate": ["rotate", "spin", "turn", "revolve"],
        "bounce": ["bounce", "jump", "spring"],
        "fade": ["fade", "appear", "disappear", "opacity"],
        "scale": ["scale", "grow", "shrink", "size"],
        "slide": ["slide", "move", "translate", "shift"]
    }
    
    for movement, keywords in movement_keywords.items():
        if any(keyword in prompt_lower for keyword in keywords):
            animation_elements["movement"].append(movement)
    
    # Detect timing
    if any(word in prompt_lower for word in ["fast", "quick", "rapid", "speed"]):
        animation_elements["timing"] = "fast"
    elif any(word in prompt_lower for word in ["slow", "gentle", "gradual"]):
        animation_elements["timing"] = "slow"
    
    return animation_elements


def generate_svg_animation(prompt: str, duration: int = 2000, 
                          animation_type: str = "simple") -> Dict[str, Any]:
    """
    Generate an SVG animation based on a prompt.
    
    Args:
        prompt: Description of the desired animation
        duration: Duration of the animation in milliseconds
        animation_type: Type of animation ('simple', 'loop', 'bounce', 'complex')
        
    Returns:
        Dictionary containing the SVG code and animation information
    """
    # Adjust duration based on animation type
    if animation_type == "complex":
        duration = max(2000, duration)  # Complex animations need at least 2 seconds
    
    # Extract animation elements from prompt
    elements = extract_animation_elements(prompt)
    
    # Adjust timing based on prompt analysis
    if elements["timing"] == "fast":
        duration = max(1000, int(duration * 0.7))
    elif elements["timing"] == "slow":
        duration = int(duration * 1.3)
    
    # Generate the SVG animation
    result = generate_simple_animation(prompt, duration, animation_type)
    
    return {
        "svg_code": result["svg_code"],
        "animation_type": animation_type,
        "duration": duration,
        "detected_elements": elements
    }
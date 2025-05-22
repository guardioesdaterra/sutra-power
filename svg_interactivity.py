"""
SVG Interactivity Module for SVG-MCP.

This module provides functions for adding interactive behaviors to SVG elements
inspired by Fabric.js. It allows for events like click, hover, and drag interactions.
"""

from typing import Dict, Any, List, Optional, Union

def add_event_handlers(svg_code: str, event_config: Dict[str, Any]) -> Dict[str, Any]:
    """
    Add event handlers to SVG elements.
    
    Args:
        svg_code: The SVG code to enhance
        event_config: Dictionary with event configuration
        
    Returns:
        Dictionary with the enhanced SVG and event information
    """
    # Extract elements and events from config
    selector = event_config.get("selector", "")
    events = event_config.get("events", [])
    
    if not selector or not events:
        return {
            "success": False,
            "error": "Missing selector or events in configuration",
            "svg_code": svg_code
        }
    
    # Create the script section with JavaScript functions
    script_content = '<script type="text/javascript"><![CDATA[\n'
    script_content += '// Function to ensure SVG is loaded before adding events\n'
    script_content += 'document.addEventListener("DOMContentLoaded", function() {\n'
    
    # Add code to get the SVG element(s)
    script_content += f'  const elements = document.querySelectorAll("{selector}");\n'
    script_content += '  if (!elements.length) {\n'
    script_content += f'    console.warn("No elements found matching selector: {selector}");\n'
    script_content += '    return;\n'
    script_content += '  }\n\n'
    
    # Process each event
    for event in events:
        event_type = event.get("type", "")
        action = event.get("action", {})
        
        if not event_type or not action:
            continue
            
        action_type = action.get("type", "")
        parameters = action.get("parameters", {})
        
        # Create event handler function based on action type
        script_content += f'  // Add {event_type} event handlers\n'
        script_content += '  elements.forEach(function(element) {\n'
        script_content += f'    element.addEventListener("{event_type}", function(e) {{\n'
        
        # The specific action implementation
        if action_type == "setAttribute":
            attr_name = parameters.get("attributeName", "")
            attr_value = parameters.get("attributeValue", "")
            script_content += f'      this.setAttribute("{attr_name}", "{attr_value}");\n'
            
        elif action_type == "toggleClass":
            class_name = parameters.get("className", "")
            script_content += f'      this.classList.toggle("{class_name}");\n'
            
        elif action_type == "animate":
            attr_name = parameters.get("attributeName", "")
            from_value = parameters.get("from", "")
            to_value = parameters.get("to", "")
            duration = parameters.get("duration", 500)
            
            script_content += '      const startTime = Date.now();\n'
            script_content += f'      const fromValue = {from_value};\n'
            script_content += f'      const toValue = {to_value};\n'
            script_content += f'      const animDuration = {duration};\n'
            script_content += '      \n'
            script_content += '      function animate() {\n'
            script_content += '        const elapsed = Date.now() - startTime;\n'
            script_content += '        const progress = Math.min(elapsed / animDuration, 1);\n'
            script_content += '        const currentValue = fromValue + (toValue - fromValue) * progress;\n'
            script_content += f'        this.setAttribute("{attr_name}", currentValue);\n'
            script_content += '        if (progress < 1) {\n'
            script_content += '          requestAnimationFrame(animate.bind(this));\n'
            script_content += '        }\n'
            script_content += '      }\n'
            script_content += '      animate.bind(this)();\n'
        
        elif action_type == "draggable":
            script_content += '      // Make element draggable\n'
            script_content += '      let selected = false;\n'
            script_content += '      let offset = { x: 0, y: 0 };\n'
            script_content += '      \n'
            script_content += '      this.addEventListener("mousedown", startDrag);\n'
            script_content += '      document.addEventListener("mousemove", drag);\n'
            script_content += '      document.addEventListener("mouseup", endDrag);\n'
            script_content += '      \n'
            script_content += '      function startDrag(e) {\n'
            script_content += '        e.preventDefault();\n'
            script_content += '        selected = true;\n'
            script_content += '        \n'
            script_content += '        // Get SVG point for mouse position\n'
            script_content += '        const svg = this.ownerSVGElement;\n'
            script_content += '        const pt = svg.createSVGPoint();\n'
            script_content += '        pt.x = e.clientX;\n'
            script_content += '        pt.y = e.clientY;\n'
            script_content += '        const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());\n'
            script_content += '        \n'
            script_content += '        // Calculate offset\n'
            script_content += '        if (this.transform && this.transform.baseVal.numberOfItems) {\n'
            script_content += '          const transform = this.transform.baseVal.getItem(0);\n'
            script_content += '          offset.x = svgP.x - transform.matrix.e;\n'
            script_content += '          offset.y = svgP.y - transform.matrix.f;\n'
            script_content += '        } else {\n'
            script_content += '          // Create transform if it doesn\'t exist\n'
            script_content += '          const transform = svg.createSVGTransform();\n'
            script_content += '          transform.setTranslate(0, 0);\n'
            script_content += '          this.transform.baseVal.appendItem(transform);\n'
            script_content += '          offset = { x: svgP.x, y: svgP.y };\n'
            script_content += '        }\n'
            script_content += '      }\n'
            script_content += '      \n'
            script_content += '      function drag(e) {\n'
            script_content += '        if (!selected) return;\n'
            script_content += '        e.preventDefault();\n'
            script_content += '        \n'
            script_content += '        const svg = this.ownerSVGElement;\n'
            script_content += '        const pt = svg.createSVGPoint();\n'
            script_content += '        pt.x = e.clientX;\n'
            script_content += '        pt.y = e.clientY;\n'
            script_content += '        const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());\n'
            script_content += '        \n'
            script_content += '        const transform = this.transform.baseVal.getItem(0);\n'
            script_content += '        transform.setTranslate(svgP.x - offset.x, svgP.y - offset.y);\n'
            script_content += '      }\n'
            script_content += '      \n'
            script_content += '      function endDrag(e) {\n'
            script_content += '        selected = false;\n'
            script_content += '      }\n'
            
        elif action_type == "tooltip":
            text = parameters.get("text", "")
            script_content += '      // Create tooltip if it doesn\'t exist\n'
            script_content += '      if (!document.getElementById("svg-tooltip")) {\n'
            script_content += '        const tooltip = document.createElementNS("http://www.w3.org/2000/svg", "text");\n'
            script_content += '        tooltip.setAttribute("id", "svg-tooltip");\n'
            script_content += '        tooltip.setAttribute("visibility", "hidden");\n'
            script_content += '        tooltip.setAttribute("font-family", "Arial");\n'
            script_content += '        tooltip.setAttribute("font-size", "12");\n'
            script_content += '        tooltip.textContent = "";\n'
            script_content += '        document.querySelector("svg").appendChild(tooltip);\n'
            script_content += '      }\n'
            script_content += '      \n'
            script_content += '      // Show tooltip\n'
            script_content += '      const tooltip = document.getElementById("svg-tooltip");\n'
            script_content += f'      tooltip.textContent = "{text}";\n'
            script_content += '      \n'
            script_content += '      // Get mouse position in SVG coordinates\n'
            script_content += '      const svg = this.ownerSVGElement;\n'
            script_content += '      const pt = svg.createSVGPoint();\n'
            script_content += '      pt.x = e.clientX;\n'
            script_content += '      pt.y = e.clientY;\n'
            script_content += '      const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());\n'
            script_content += '      \n'
            script_content += '      // Position and show tooltip\n'
            script_content += '      tooltip.setAttribute("x", svgP.x + 10);\n'
            script_content += '      tooltip.setAttribute("y", svgP.y - 10);\n'
            script_content += '      tooltip.setAttribute("visibility", "visible");\n'
            
        elif action_type == "custom":
            custom_code = parameters.get("code", "")
            script_content += f'      // Custom code\n{custom_code}\n'
            
        # Close the event listener function and forEach
        script_content += '    });\n'
        script_content += '  });\n\n'
    
    # Close the DOMContentLoaded event listener
    script_content += '});\n'
    script_content += ']]></script>\n'
    
    # Add necessary styles for interactivity
    style_content = '<style type="text/css"><![CDATA[\n'
    
    # Add specific styles based on events
    has_hover = any(event.get("type") == "mouseover" for event in events)
    has_drag = any(event.get("action", {}).get("type") == "draggable" for event in events)
    
    if has_hover:
        style_content += f'{selector}:hover {{ cursor: pointer; }}\n'
    
    if has_drag:
        style_content += f'{selector}.dragging {{ cursor: grabbing; }}\n'
        style_content += f'{selector} {{ cursor: grab; }}\n'
    
    style_content += ']]></style>\n'
    
    # Insert script and style into SVG
    if "</svg>" in svg_code:
        enhanced_svg = svg_code.replace("</svg>", f"{style_content}{script_content}</svg>")
    else:
        enhanced_svg = f"{svg_code}\n{style_content}{script_content}"
    
    return {
        "success": True,
        "svg_code": enhanced_svg,
        "events_added": len(events),
        "selectors_targeted": selector
    }


def add_svg_interactivity(svg_code: str, interaction_type: str, 
                         selector: str, configuration: Dict[str, Any]) -> Dict[str, Any]:
    """
    Add interactivity to SVG elements.
    
    Args:
        svg_code: The SVG code to modify
        interaction_type: Type of interaction ('click', 'hover', 'drag', 'tooltip', 'custom')
        selector: CSS-like selector for target elements
        configuration: Dictionary with interaction details
        
    Returns:
        Dictionary containing the enhanced SVG code and details
    """
    if not svg_code:
        return {
            "success": False,
            "error": "Empty SVG code provided",
            "svg_code": svg_code
        }
    
    if not selector:
        return {
            "success": False,
            "error": "No selector provided for target elements",
            "svg_code": svg_code
        }
        
    if not interaction_type or interaction_type not in ["click", "hover", "drag", "tooltip", "custom"]:
        return {
            "success": False,
            "error": f"Invalid interaction type: {interaction_type}. Valid types: click, hover, drag, tooltip, custom",
            "svg_code": svg_code
        }
    
    # Create event configuration
    event_config = {
        "selector": selector,
        "events": []
    }
    
    # Configure events based on interaction type
    if interaction_type == "click":
        event_config["events"].append({
            "type": "click",
            "action": {
                "type": configuration.get("action", "setAttribute"),
                "parameters": configuration.get("parameters", {})
            }
        })
    
    elif interaction_type == "hover":
        # Mouse over
        event_config["events"].append({
            "type": "mouseover",
            "action": {
                "type": configuration.get("mouseoverAction", "setAttribute"),
                "parameters": configuration.get("mouseoverParameters", {})
            }
        })
        
        # Mouse out
        event_config["events"].append({
            "type": "mouseout",
            "action": {
                "type": configuration.get("mouseoutAction", "setAttribute"),
                "parameters": configuration.get("mouseoutParameters", {})
            }
        })
    
    elif interaction_type == "drag":
        event_config["events"].append({
            "type": "mousedown",
            "action": {
                "type": "draggable",
                "parameters": {}
            }
        })
    
    elif interaction_type == "tooltip":
        event_config["events"].append({
            "type": "mouseover",
            "action": {
                "type": "tooltip",
                "parameters": {
                    "text": configuration.get("text", "Tooltip")
                }
            }
        })
        
        # Hide tooltip on mouseout
        event_config["events"].append({
            "type": "mouseout",
            "action": {
                "type": "custom",
                "parameters": {
                    "code": 'document.getElementById("svg-tooltip").setAttribute("visibility", "hidden");'
                }
            }
        })
    
    elif interaction_type == "custom":
        for event_type, action in configuration.get("events", {}).items():
            event_config["events"].append({
                "type": event_type,
                "action": action
            })
    
    # Process the SVG with event handlers
    result = add_event_handlers(svg_code, event_config)
    
    return {
        "success": result["success"],
        "error": result.get("error", ""),
        "svg_code": result["svg_code"],
        "interaction_type": interaction_type,
        "selector": selector,
        "events_added": result.get("events_added", 0)
    }
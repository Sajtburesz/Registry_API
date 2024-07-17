from flask import Flask, request, jsonify
from flasgger import Swagger

app = Flask(__name__)
swagger = Swagger(app)

registry = set()
inverted = False

@app.route('/add', methods=['POST'])
def add_to_set():
    """
    This is an endpoint for adding new items to the registry set.
    ---
    parameters:
      - name: item
        in: body
        type: string
        required: true
        description: Item to add to the registry
        schema:
          type: object
          properties:
            item:
              type: string
    responses:
        422:
            description: Item's format was unacceptable.
        204:
            description: Item added successfully.
    """
    data = request.json
    item = data.get('item')
    
    if not isinstance(item, str) or not item.isalnum():
        return jsonify({"error": "Item contains non alphanumeric characters or item is not a string."}), 422

    registry.add(item)
    
    return '', 204


@app.route('/remove/<item>', methods=['DELETE'])
def remove_from_set(item: str):
    """
    This is an endpoint for removing items from the registry set.
    ---
    parameters:
      - name: item
        in: path
        type: string
        required: true
        description: Item to remove from the registry
    responses:
        422:
            description: Item's format was unacceptable.
        204:
            description: Item removed successfully or Item was not in registry thus removing was successful.
    """
    if not isinstance(item, str) or not item.isalnum():
        return jsonify({"error": "Item contains non alphanumeric characters or item is not a string."}), 422

    if item not in registry:
        return '', 204
    
    registry.remove(item)

    return '', 204

@app.route('/check/<item>', methods=['GET'])
def check_item_in_registry(item: str):
    """
    This is an endpoint for checking if item is in the registry set.
    ---
    parameters:
      - name: item
        in: path
        type: string
        required: true
        description: Item to check in the registry
    responses:
        422:
            description: Item's format was unacceptable.
        400:
            description: Item is not in registry.
        200:
            description: Item is in registry.
    """
    if not isinstance(item, str) or not item.isalnum():
        return jsonify({"message": "Item contains non alphanumeric characters or item is not a string."}), 422

    if item not in registry and not inverted:
        return jsonify({"error": f"{item} is not in the registry."}), 400
    else:
        if item in registry and inverted:
            return jsonify({"error": f"{item} is not in the registry."}), 400

        return jsonify({"message": f"{item} is in the registry."}), 200

@app.route('/invert', methods=['POST'])
def invert_set():
    """
    This is an endpoint for inverting the registry set.
    ---
    responses:
        200:
            description: Setting the new inverted status was successful.
    """
    global inverted
    inverted = not inverted
    return jsonify({"message": f"Set inverted {inverted}"}), 200

@app.route('/diff', methods=['POST'])
def diff_set():
    """
    This is an endpoint for comparing two sets of items and returning the difference.
    ---
    parameters:
      - name: items
        in: body
        type: array
        required: true
        description: List of items to compare with the registry
        schema:
          type: object
          properties:
            items:
              type: array
              items:
                type: string
    responses:
        400:
            description: Item's format was unacceptable.
        200:
            description: Diff was successful and a list was returned.
    """
    data = request.json
    items = data.get('items')
    
    if not isinstance(items, (list, set)) or any(not isinstance(item, str) or not item.isalnum() for item in items):
        return jsonify({"error": "Invalid items"}), 400
    
    items_set = set(items)
    diff_items = list(items_set - registry)
    
    return jsonify({"diff": diff_items}), 200


if __name__ == '__main__':
    app.run(debug=True)
